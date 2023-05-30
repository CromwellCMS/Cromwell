const withTM = require('next-transpile-modules')([
  '@cromwell/plugin-product-filter',
  '@uiw/react-textarea-code-editor',
]);

module.exports = withTM({
  basePath: '/admin',
  async rewrites() {
    return [
      // Rewrite everything to `pages/index`
      {
        source: '/:any*',
        destination: '/',
      },
    ];
  },
});
