const withTM = require('next-transpile-modules')([
  '@cromwell/plugin-product-filter',
  '@uiw/react-textarea-code-editor',
]);

module.exports = withTM({
  async rewrites() {
    return [
      // Rewrite everything to `pages/index`
      {
        source: '/admin/:any*',
        destination: '/admin/',
      },
    ];
  },
});
