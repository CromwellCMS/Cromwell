import { join, resolve } from 'path';
import { ORMEntities, defaultCmsConfig } from '../src/helpers/constants';
import { ConnectionOptions, createConnection, getConnection, getCustomRepository } from 'typeorm';

export const mockWorkingDirectory = async (name: string): Promise<string> => {
    const testDir = resolve(process.cwd(), '.cromwell/test', name);

    const spy = jest.spyOn(process, 'cwd');
    spy.mockReturnValue(testDir);

    return testDir;
}

export const connectDatabase = async () => {
    const connectionOptions: ConnectionOptions = {
        type: "sqlite",
        database: resolve(process.cwd(), 'db.sqlite3'),
        entityPrefix: 'crw_',
        synchronize: true,
        entities: [
            ...ORMEntities,
        ]
    }

    await createConnection(connectionOptions);
}
