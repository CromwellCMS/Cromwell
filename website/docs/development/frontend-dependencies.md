---
sidebar_position: 4
---

# Frontend Dependencies

## Issue with dependencies

A website can have dozens of Plugins and each of them can have many heavy dependencies (node_modules), especially in modern React development. There are two main problems:

1. Bloating size of bundles. React, Material UI, plus some other libraries and a Plugin can easily grow up to 500Kb and more. With many Plugins the website may be very slow to load.
2. Multiple instances of dependencies. For example, if you have bundled two React or Material UI libraries and then try to render them in one app, it will crash.

To solve the issue Cromwell CMS has a feature called Frontend dependencies.   

Frontend dependencies are pre-bundled node_modules that Plugins and Themes can import in a similar to [Require.js](https://requirejs.org/) way. Difference is that they are bundled using Webpack code splittings and chunking which allows to avoid full library load, instead it loads only enough chunks for used imports to work.

## How to use

There's no difference in source code, so you can use node_modules as usual:
```ts
import { TextField } from '@material-ui/core';
import React from 'react';
```

You need to declare Frontend dependencies in your package.json and add it to "dependencies" with **exact** version:
```json
{
  "name": "your-plugin-name",
  "version": "1.0.0",
  "dependencies": {
    "@material-ui/core": "4.11.2"
  },
  "cromwell": {
    "type": "plugin",
    "frontendDependencies": [
      "@material-ui/core"
    ]
  }
}
```

Transformation happens when you run Cromwell CMS bundler via `npx cromwell build`. Bundler points Frontend dependencies to the global store (for all Plugins to reuse) and generates meta info files. When the CMS needs to display a Plugin, it reads its meta info file, loads and executes Frontend dependencies first, then executes code of the Plugin.  

Note that you don't have to include React because it used by the CMS core, so it is a Default Frontend dependency.
Default Frontend dependencies are always bundled with Themes, and they are initially available in the global store to use. There's the list of such dependencies: @apollo/client, @cromwell/core, @cromwell/core-frontend, @loadable/component, react, react-dom, react-html-parser, react-is, tslib, react-resize-detector, pure-react-carousel, react-image-lightbox  


## Where to get

#### GiHub repo
Cromwell CMS provides a [number of ready Frontend dependencies](https://github.com/CromwellCMS/bundled-modules). If they are referenced in package.json, they will be checked and downloaded upon system startup or any build command. Note that it is important to have exact dependency version in package.json because we don't use npm version resolution mechanism here, all modules downloaded from the GitHub repo by their name and exact version.  
You should use them when it's possible instead of other node modules or self-bundled Frontend dependencies. It's important to maintain same bundles and versions across all Plugins/Themes.  
Especially it's useful for distribution, when a user installs your Theme, the CMS will automatically download its Frontend dependencies.

#### Self-bundled
This is experimental feature, docs will follow in the future.


## Maintaining

As dependencies updated by their authors, we will bundle and upload new versions. So on a website potentially we can have installed two Plugins that reference different versions of one Frontend dependency.
When these Plugins will be displayed at the frontend, the CMS will import only dependency of a first discovered Plugin (which placed higher on the page), then this dependency will be cached and reused for other Plugins. To avoid collisions and multiple instance problem dependencies are re-used by their name, ignoring version.  

Basically we want to use a new version, or ot least same version for all Plugins. For this purpose in Cromwell CMS we have bindings between CMS version and Frontend dependencies. You can check it here: [/frontend-dependencies](/frontend-dependencies).  
Plugin/Theme authors must check version of their dependencies and CMS releases. If Frontend dependency has been updated in a new CMS release, then author has to update it in his package and make a new release.   
Plugins should be backward-compatible. New features appeared in a release of Frontend dependency should be checked before use, so Plugin won't crash with an old version.

When making a new Plugin you probably don't want to support all previous versions of Frontend dependencies, so you can set (min CMS version in your cmsconfig.json)[/#todo]


## Big modules problem

As we stated before bundled node modules are chunked, so we can import only things we need. It works well on medium-size modules such as `@material-ui/core`, but not well with big such as `@material-ui/icons` which has more than 5000 exports.
In order for browser-imports to work we need to load manifest file to know what chunk to request for imports used in our app. While it's possible to make a couple-Kb chunk for each of 5000 icons from `@material-ui/icons`, the manifest for all of them will be more than 500kb. In this case it makes sense to avoid using Frontend dependency and include icons in source code as we did in [default @cromwell/theme-store](https://github.com/CromwellCMS/Cromwell/blob/master/themes/store/src/components/icons.tsx)  


## Too many requests problem
