---
sidebar_position: 3
---

# Module configuration

CMS Module is either Theme or Plugin. They both use similar configuration files.


## Package.json info

`package.json` file stores info about your Module. Cromwell CMS uses it to recognize that a package is a CMS Module, so it's required to have.  
All info goes under `cromwell` property:
```json title="package.json"
{
  "name": "your-plugin-name",
  "version": "1.0.0",
  "cromwell": {
    "type": "plugin",
    "title": "You Plugin's title",
    "icon": "static/icon_showcase.png"
  }
}
```
All available properties:
- **type** - Type of Module. Can have one of two values: "plugin" or "theme". This is only one required property.
- **title** - Title of Module to display in Admin panel
- **excerpt** - Short description about your Module. For example, used in Themes page in Theme cards
- **description** - Full description about your Module. For example, used when a user opens info about Theme.
- **link** - Link to Plugin's website.
- **author** - Name of author of Module
- **authorLink** - Link to the author's website
- **icon** - Path to an icon, relative to the project root: "static/my-icon.png". For example, used in Plugins page of Admin panel.
- **image** - Path to main image of Module. Used in Theme card at Themes page. 
- **images** - Array of paths to additional images. Used when a user opens Theme info in pop-up.
- **minCmsVersion** - Minimal CMS version since when this module is available to install. Exact npm package semver version.
- **frontendDependencies** - [Frontend dependencies](/docs/development/frontend-dependencies)
- **firstLoadedDependencies** - [Bundled Frontend dependencies](/docs/development/frontend-dependencies#too-many-requests)


## Module JS config

For more advanced configuration you can optionally setup JS config.  
Config exported from `cromwell.config.js` file in the root of your project.  

```tsx title="cromwell.config.js"
module.exports = {
  rollupConfig: () => {
    /* ... */
  },
  /* ... */ 
}
```

Config properties:

- **rollupConfig** - Function that returns an object with custom Rollup options to pre-build Theme or build Plugin. [Example](https://github.com/CromwellCMS/Cromwell/blob/master/themes/store/cromwell.config.js#L10). Require your development dependencies inside this function, so when the CMS will have to look for other properties, it won't have to require() them. The function exports Rollup options under properties directed at different parts of a target bundle:
  - `main` - default config used in all cases unless overwritten by other properties.
  - `adminPanel` - Options to use (override) for Plugin's admin panel bundle.
  - `frontend` - Options for Plugin's frontend bundle
  - `backend` - Options for Plugin's backend bundle.
- **nextConfig** - Function that returns [Next.js config](https://nextjs.org/docs/api-reference/next.config.js/introduction) for Theme build. This config is usually exported from next.config.js file. The returned config should be an object.
- **headHtml**`: string` - Custom HTML to inject in the head of every page of a Theme.
- **footerHtml**`: string` - Custom HTML to inject at the end of every page of a Theme.
- **globalCss**`: string[]` - Only for Themes. Paths to global CSS that you usually use in _app.(tsx|jsx) file. In Cromwell CMS your Theme pages will be wrapped by root components, so if you have global CSS, Next.js will throw an error that it exported not from _app. Add your global CSS into this array, so it will be properly injected in a root _app file.
- **defaultPages** - Paths for default CMS pages. See more in [Theme development](/docs/development/theme-development#default-pages)
- **pages** - Configs for [Theme's pages](/docs/development/theme-development#configure-pages)
- **defaultSettings** - Initial [Plugin settings](/docs/development/plugin-development#plugin-settings) used to initialize database when Plugin installed.

