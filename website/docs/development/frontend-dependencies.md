---
sidebar_position: 4
---

# Frontend Dependencies

[Latest Frontend dependencies](/latest-frontend-dependencies)

## Motivation

A website can have dozens of Plugins and each of them can have many heavy dependencies (node_modules), especially in modern React development. There are two main problems:

1. Bloating size of bundles. React, Material UI, plus some other libraries and a Plugin can grow up to 500Kb and more. With many Plugins a website may be very slow to load.
2. Multiple instances of dependencies. For example, if you have bundled two React or Material UI libraries and then try to render them in one app, it will crash.

To solve the issue Cromwell CMS has a feature called Frontend dependencies.   

Frontend dependencies are pre-bundled node_modules that Plugins and Themes can import and re-use asynchronously in the browser. The feature is similar to [Require.js](https://requirejs.org/). Difference is that modules are bundled using Webpack code splittings and chunking which allows avoiding full library load, instead it loads only enough chunks for used imports to work. Once a Frontend dependency is imported by any Plugin, it then can be re-used by any other.  
All imports are centralized, if one Plugin is importing a dependency, and another will need it at this time too, another Plugin will wait for the first, so no chunks of node_modules loaded twice. 

## How to use

You can use Frontend dependencies as usual ES modules with the condition that everything is imported from the root of the module:
```ts
import { Button, TextField } from '@mui/material';
import React from 'react';
``` 
Not: <s>`import TextField from '@mui/material/TextField'`</s>

You need to add Frontend dependencies into `frontendDependencies` array of your package.json and use them with **exact** version in "dependencies":
```json
{
  "name": "your-plugin-name",
  "version": "1.0.0",
  "dependencies": {
    "@mui/material": "5.10.17"
  },
  "cromwell": {
    "type": "plugin",
    "frontendDependencies": [
      "@mui/material"
    ]
  }
}
```

Transformation happens when you run Cromwell CMS builder via `npx cromwell build`. Builder will point imports to the global store (for all Plugins to reuse) and generates additional meta info files. When the CMS needs to display a Plugin, it reads its meta info file, loads and executes Frontend dependencies first, then executes code of the Plugin.  

:::note
You don't have to include React because it is used by the CMS core, so it is a Default Frontend dependency.
Default Frontend dependencies are always bundled with Themes, and they are initially available in the global store to use. There's the list of such dependencies: @apollo/client, @cromwell/core, @cromwell/core-frontend, @loadable/component, react, react-dom, react-html-parser, react-is, tslib, react-resize-detector, pure-react-carousel, react-image-lightbox  
:::


## Where to get

#### GiHub repo
Cromwell CMS provides a [number of ready Frontend dependencies](/latest-frontend-dependencies) from its GitHub repo. If they are referenced in your package.json, they will be checked and downloaded automatically upon system startup or any build command. Note that it is important to have the exact dependency version in package.json because we don't use npm version resolution mechanism here, all modules are downloaded from the GitHub repo by their name and exact version.  
You should use them when it's possible instead of other node modules or self-bundled Frontend dependencies. It's important to maintain same bundles and versions across all Plugins/Themes.  
Especially it's useful for distribution, when a user installs your Theme, the CMS will automatically download its Frontend dependencies.

#### Self-bundled
This is an experimental feature, docs will follow in the future.


## Maintaining

As original packages are updated by their authors, we will bundle and upload new versions of Frontend dependencies. So on a website potentially we can have installed two Plugins that reference different versions of one Frontend dependency.
When these Plugins will be displayed at the frontend, the CMS will import only dependency of a first discovered Plugin (which is placed higher on the page), then this dependency will be cached and reused for other Plugins. To avoid collisions and multiple instance problem dependencies are re-used by their name, ignoring version.  

Basically, we want to use a new version, or at least the same version for all Plugins. For this purpose in Cromwell CMS we reference latest dependencies at the page: [/latest-frontend-dependencies](/latest-frontend-dependencies).  
Plugin/Theme authors must check the version of their dependencies and CMS releases. If Frontend dependency has been updated with a new CMS release, then the author has to update it in his package and make a new release.   
Plugins should be backward-compatible. New features that appeared in a release of Frontend dependency should be checked before use in a Plugin, so Plugin won't crash with an old version.

When making a new Plugin you don't want to support all previous versions of Frontend dependencies, and if you worry that some older version may crash your Plugin, you can set [minimal CMS version. See minCmsVersion in package.json info](./module-config#packagejson-info). In case if a user with an older CMS version will try to install your plugin, he will be notified that he must update his CMS first to use your Plugin.


## Big modules

As we stated before bundled node modules are chunked, so we can load only things we need. It works well on medium-size modules such as `@mui/material`, but not well with big such as `@mui/icons-material` which has more than 5000 exports.
In order for browser imports to work, Webpack has to generate a manifest to know what chunk to request for imports used in our app. While it's possible to make a couple-Kb chunk for each of 5000 icons from `@mui/icons-material`, the manifest for all of them will be more than 500kb. Which is clearly will be much more than size of icons we are going to ever use from it. In this case, it makes sense to avoid using Frontend dependency. You can still use it as usual via `import`, but don't include it in `frontendDependencies` in `package.json`.

:::note
When developing a Plugin, you may get a problem bundling huge modules, because bundling is handled by Rollup instead of Webpack as with Themes. For example, Rollup has a problem bundling `@mui/icons-material`. So you may want to include full code of icons in your source code instead of importing it from the package.
:::


## Bundled dependencies

If some Theme's dependent Plugins make too many requests for chunks, it may have an impact on performance. To optimize it you can specify what Frontend dependencies to bundle entirely with Theme in one chunk.
Just list them in package.json's cromwell info under `firstLoadedDependencies` property:
```json title="package.json"
{
  "name": "your-plugin-name",
  "version": "1.0.0",
  "cromwell": {
    "type": "plugin",
    "frontendDependencies": [
      "@mui/material"
    ],
    "firstLoadedDependencies": [
      "@mui/material",
      "jss",
      "jss-plugin-global",
      "jss-plugin-nested",
      /* ... */
    ]
  }
}
```
This option will improve performance of Cromwell CMS builder.  

:::note
Example: In @cromwell/theme-store compiler had to generate chunks for more than 8k possible export keys from packages, it slowed down compilation time. With `firstLoadedDependencies` we have cut most of them and reduced compiling time.  
Often, if an app used a lot of exports from a library, size of requested chunks at run-time may be close to size of entire library, so it makes sense to include it in "firstLoadedDependencies". For us it was better to bundle "@mui/material" entirely, though it's a huge package.  
:::

Listing sub-dependencies will also help to optimize compilation and usage in run-time. For example, we know that "@mui/material" uses "jss" and it will be bundled entirely with it anyway, so we listed it as well.