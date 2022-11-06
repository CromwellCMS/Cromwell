import { setStoreItem } from '@cromwell/core';
import fs from 'fs-extra';
import normalizePath from 'normalize-path';
import { isAbsolute, resolve } from 'path';
import { ConnectionOptions, createConnection, Logger } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

import { readCMSConfig } from './cms-settings';
import { getMigrationsDirName, ORMEntities } from './constants';
import { getLogger } from './logger';
import { getServerDir, getServerTempDir } from './paths';
import { collectPlugins } from './plugin-exports';

const logger = getLogger();

export type Writeable<T> = {
  -readonly [P in keyof T]: T[P];
};

export type DeepWriteable<T> = {
  -readonly [P in keyof T]: DeepWriteable<T[P]>;
};

export const connectDatabase = async ({
  ormConfigOverride,
  development,
}: {
  ormConfigOverride?: Partial<Writeable<ConnectionOptions & MysqlConnectionOptions>>;
  development?: boolean;
}) => {
  const cmsConfig = await readCMSConfig();
  const tempDBPath = normalizePath(resolve(getServerTempDir(), 'db.sqlite3'));

  const defaultOrmConfig: ConnectionOptions = {
    type: 'sqlite',
    database: tempDBPath,
    entityPrefix: 'crw_',
    migrationsTableName: 'crw_migrations',
    cli: {
      migrationsDir: 'migrations/sqlite',
    },
    logging: ['error', 'warn', 'info', 'migration'],
    logger: {
      logQuery: () => null,
      logQueryError: logger.error,
      logQuerySlow: logger.warn,
      logSchemaBuild: logger.log,
      logMigration: logger.info,
      log: (level, message) => {
        if (level === 'info') logger.info(message);
        if (level === 'warn') logger.warn(message);
        if (level === 'log') logger.log(message);
      },
    } as Logger,
  };

  let hasDatabasePath = false;
  const serverDir = getServerDir();
  if (cmsConfig?.orm?.database) hasDatabasePath = true;

  let ormconfig: DeepWriteable<ConnectionOptions> = Object.assign(
    {},
    defaultOrmConfig,
    ormConfigOverride,
    cmsConfig.orm,
  );

  if (!ormconfig.cli) ormconfig.cli = {};
  ormconfig.cli.migrationsDir = getMigrationsDirName(ormconfig.type);

  if (!ormconfig || !ormconfig.type) throw new Error('Invalid ormconfig');
  setStoreItem('dbInfo', {
    dbType: ormconfig.type,
  });

  // Adjust unset options for different DBs
  const adjustedOptions: Partial<DeepWriteable<ConnectionOptions & MysqlConnectionOptions>> = {};
  adjustedOptions.migrationsRun = true;
  adjustedOptions.synchronize = false;

  if (ormconfig.type === 'sqlite') {
    if (development) {
      adjustedOptions.synchronize = true;
      adjustedOptions.migrationsRun = false;
    }

    if (!hasDatabasePath) {
      if (!(await fs.pathExists(defaultOrmConfig.database)) && serverDir) {
        // Server probably was launched at the first time and has no DB created
        // Use mocked DB
        const mockedDBPath = resolve(serverDir, 'db.sqlite3');
        if (await fs.pathExists(mockedDBPath)) {
          await fs.copy(mockedDBPath, tempDBPath);
        }
      }
    }
  }

  if (ormconfig.type === 'mysql' || ormconfig.type === 'mariadb') {
    adjustedOptions.timezone = '+0';
  }

  if (ormconfig.type === 'postgres') {
    adjustedOptions.timezone = '+0';
  }

  ormconfig = Object.assign(adjustedOptions, ormconfig);

  const pluginExports = await collectPlugins({ updateCache: true });

  const connectionOptions: ConnectionOptions = {
    ...(ormconfig as ConnectionOptions),
    entities: [...ORMEntities, ...(pluginExports.entities ?? ([] as any)), ...(ormconfig?.entities ?? [])],
    migrations: [
      ...(pluginExports.migrations ?? ([] as any)),
      serverDir && ormconfig?.cli?.migrationsDir
        ? normalizePath(resolve(serverDir, ormconfig.cli.migrationsDir)) + '/*.js'
        : '',
    ].filter(Boolean),
  };

  if (connectionOptions) await createConnection(connectionOptions);
};
