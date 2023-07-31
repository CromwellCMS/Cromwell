const patches = [
  {
    package: '@apollo/server',
    requireName: './errorNormalize.js', // @apollo/server/dist/cjs/errorNormalize.js
    getPatchedModule: (getPackage) => ({
      normalizeAndFormatErrors: (errors, options = {}) => {
        const formatError = options.formatError ?? ((error) => error);

        function newHTTPGraphQLHead(status) {
          return {
            status,
            headers: new (getPackage().HeaderMap)(),
          };
        }
        const httpFromErrors = (0, newHTTPGraphQLHead)();

        return {
          httpFromErrors,
          formattedErrors: errors.map((error) => {
            try {
              return formatError(error, error);
            } catch (formattingError) {
              return {
                message: 'Internal server error',
                extensions: { code: 500 },
              };
            }
          }),
        };
      },
    }),
  },
];

const Module = require('module');
const normalizePath = require('normalize-path');
const originalLoad = Module._load;

const cachedPackages = {};

// Override the '_load' method
Module._load = function (request, parent) {
  // Load the module using the original '_load' method
  const loadedModule = originalLoad.apply(this, arguments);

  for (const patch of patches) {
    if (patch.requireName === request) {
      const filePath = normalizePath(parent.path);

      if (!filePath.includes('node_modules/' + patch.package)) continue;
      const toReplace = patch.getPatchedModule(() => cachedPackages[patch.package]);
      for (const [key, value] of Object.entries(toReplace)) {
        // console.log('patched key', key, 'in', patch.package);
        loadedModule[key] = value;
      }
    }
  }

  // Return the (possibly modified) loaded module
  return loadedModule;
};

for (const patch of patches) {
  cachedPackages[patch.package] = require(patch.package);
}
