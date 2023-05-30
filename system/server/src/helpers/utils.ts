import Container from 'typedi';

type Constructor<T> = new (...args: any[]) => T;

export const getDIService = <T>(Ctor: Constructor<T>): T => {
  const lazyInstance: any = new Proxy(
    {},
    {
      get(target, prop) {
        const instance = Container.get(Ctor);
        return instance[prop];
      },
    },
  );

  return lazyInstance;
};
