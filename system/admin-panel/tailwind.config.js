const { getAdminPanelDir } = require('@cromwell/core-backend/dist/helpers/paths');

const content = `${getAdminPanelDir()}/src/**/*.{tsx,jsx,ts,js}`

module.exports = {
  content: [content],
  theme: {
    extend: {},
  },
  plugins: [],
  darkMode: 'class'
}
