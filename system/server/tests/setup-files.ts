
jest.mock('../src/helpers/serverFireAction', () => {
    return {
        serverFireAction: () => null,
    }
});

jest.mock('winston', () => {
    class Console { }
    class File { }
    return {
        format: {
            printf: () => ({}),
            timestamp: () => ({}),
            combine: () => ({}),
        },
        transports: {
            File: File,
            Console: Console,
        },
        createLogger: () => {
            return {
                log: () => null,
                info: () => null,
                warn: () => null,
                error: () => null,
            }
        },
    }
});
