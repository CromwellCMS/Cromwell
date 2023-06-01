const withTM = require('next-transpile-modules')([
  '@cromwell/plugin-product-filter',
  '@uiw/react-textarea-code-editor',
]);

const config = {
  basePath: '/admin',
};

if (process.env.NODE_ENV === 'development') {
  config.rewrites = () => {
    return [
      // Rewrite everything to `pages/index`
      {
        source: '/:any*',
        destination: '/',
      },
    ];
  };
} else {
  config.output = 'export';
}

module.exports = withTM(config);
