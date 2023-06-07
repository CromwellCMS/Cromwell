const normalize = require('normalize-path');

/**
 * At least until this issue fixed https://github.com/facebook/react/issues/24270#issuecomment-1435693546
 */
module.exports = function (source) {
  const fileName = normalize(this.resourcePath);

  if (fileName.includes('node_modules/react-dom')) {
    if (source.includes('exports.createPortal')) {
      // For dev
      source = source.replace(`throw new Error('Hydration failed`, `console.warn('Hydration failed`);
      source = source.replace(
        `var ConcurrentMode =
/*                 */
1;`,
        'var ConcurrentMode = 0;',
      );

      // For prod
      source = source.replace(/throw [^;]*\(418\)\);/g, 'console.warn("Hydration failed");');
      source = source.replace(/throw [^;]*\(425\)\);/g, 'console.warn("Hydration failed");');
    }
  }

  return source;
};
