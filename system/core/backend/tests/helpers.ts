import fs from 'fs-extra';
import { resolve } from 'path';
import { ConnectionOptions, createConnection } from 'typeorm';

import { ORMEntities } from '../src/helpers/constants';

export const mockWorkingDirectory = (name: string): string => {
  const testDir = resolve(process.cwd(), '.cromwell/test', name);

  const spy = jest.spyOn(process, 'cwd');
  spy.mockReturnValue(testDir);

  return testDir;
};

export const connectDatabase = async () => {
  const connectionOptions: ConnectionOptions = {
    type: 'sqlite',
    database: resolve(process.cwd(), 'db.sqlite3'),
    entityPrefix: 'crw_',
    synchronize: true,
    entities: [...ORMEntities],
  };

  await createConnection(connectionOptions);
};

export const clearTestDir = () => {
  const testDir = resolve(process.cwd(), '.cromwell');
  if (fs.pathExistsSync(testDir)) fs.removeSync(testDir);
};
