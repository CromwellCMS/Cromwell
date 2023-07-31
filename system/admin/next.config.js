const withTM = require('next-transpile-modules')([
  '@cromwell/plugin-product-filter',
  '@uiw/react-textarea-code-editor',
]);

const config = {};

if (process.env.NODE_ENV === 'development') {
  config.rewrites = () => {
    return [
      // Rewrite everything to `pages/index`
      {
        source: '/admin/:any*',
        destination: '/',
      },
    ];
  };
} else {
  config.output = 'export';
  config.basePath = '/admin';
  config.staticPageGenerationTimeout = 360;
}

module.exports = withTM(config);
