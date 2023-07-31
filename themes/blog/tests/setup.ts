import '@testing-library/jest-dom/extend-expect';

window.fetch = () =>
  new Promise((done) =>
    done({
      status: 200,
      json: () => new Promise((done) => done(null)),
      text: () => new Promise((done) => done(null)),
    }),
  ) as any;
