const { getAdminPanelDir } = require('@cromwell/core-backend/dist/helpers/paths');

module.exports = {
  plugins: {
    'postcss-preset-env': {},
    tailwindcss: { config: `${getAdminPanelDir()}/tailwind.config.js` },
    'autoprefixer': {},
  },
};