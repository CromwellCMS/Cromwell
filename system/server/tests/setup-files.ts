jest.doMock('../src/helpers/server-fire-action', () => {
  return {
    serverFireAction: () => null,
  };
});

jest.doMock('winston', () => {
  class Console {}
  class File {}
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
      };
    },
  };
});
