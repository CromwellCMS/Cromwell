---
sidebar_position: 1
---

# Theme development

Cromwell CMS follows principles of headless CMS where API server runs separately from its frontend server. So basically you can create any type of frontend and host it wherever you like. But in this scenario you need to manage and deploy this frontend by yourself.  
To simply the workflow Cromwell CMS has its theming engine. Users can easily install Themes from the official market right in their Admin panel GUI, make active, delete them, change layout in the Theme Editor as long as Themes follow guidelines we are going to show.  

Cromwell CMS Theme is a Next.js app. Theme development is basically Next.js development. If you are not familiar with Next.js, [you should definitely start with it first](https://nextjs.org/docs/getting-started).   


## Create a project

As in the [Installation guide](/docs/overview/installation#4-cromwell-cli), Cromwell CLI can create a new project template. Use `--type theme` argument if you want to create Theme or `--type plugin` for Plugin.  
```bash
npx @cromwell/cli create --type theme my-theme-name
```

## Project structure

- **`cromwell.config.js`** - [Optional config file for your Theme/Plugin.](/docs/development/module-config)  
- **`src/pages`** - Directory for Next.js pages. By default there's `index.tsx` created by CLI. You can rename it to .jsx if you don't want to work with TypeScript (which is discouraged).
- **`static`** - Directory for static files (images). After installation of this Theme by end user files from `static` directory will be copied into `public` directory of the CMS, from where they will be served to the frontend. In your code you can access static files of your Theme through the following pattern: `/themes/${packageName}/${pathInStaticDir}`.  
Image example:  `<img src="/themes/@cromwell/theme-store/free_shipping.png" />`



## Compile

To make your Theme work with the CMS we need to run additional [pre-build phase](#pre-build-phase). With that you cannot directly use Next.js CLI, but Cromwell CLI has a replacement which works in a similar way.  

First you may optionally start the CMS to retrieve data/plugins from API server:
```bash
npx cromwell start --detached 
```
Or via shortcut:
```bash
npx crw s -d
```

To start Next.js development server with watcher (same as `next dev`):
```bash
npx cromwell build -w
```
Or via shortcut:
```bash
npx crw b -w
```
Open [http://localhost:4256/](http://localhost:4256/) to see your website.  

When your Theme is ready and you want to try it with the CMS in production environment, your need to build it. Same as `next build`:
```bash
npx cromwell build
```

Now you can go into Admin panel > Themes > click "Set active" on your Theme card. It will change active CMS Theme at [http://localhost:4016/](http://localhost:4016/)


## Pre-build phase

This is a multipurpose phase that happens before we run Webpack compiler of Next.js.

1. We wrap your pages in a root component that requests and injects settings from Admin panel such as custom head HTML, meta data (SEO), settings for Plugins, etc.

2. Cromwell CMS needs to generate meta info files on your source code. In order to parse your files, we need to transpile them into plain JavaScript first.

3. We make your Frontend dependencies available to re-use for Plugins. See [Frontend dependencies](#todo) page for details.


## Customize bundler

We use [Rollup](https://rollupjs.org) for the pre-build phase. Which means you need to change Rollup config if you want to customize your build. The purpose of the phase is to build plain JavaScript, so you won't need to customize Next.js's Webpack config.  

By default CMS build command can transpile React and handle CSS/SASS (by passing stylesheets to Next.js).  
After generating Theme template with Cromwell CLI, you will also have TypeScript compiler in the build config.

Open `cromwell.config.js`. You can see there's `rollupConfig` function that returns configuring object in the format: 
```javascript
{
    main: RollupOptions,
}
```
Usually `RollupOptions` is an object that exported from [Rollup Config File](https://rollupjs.org/guide/en/#configuration-files). But might need to use different configs, so we return them in the `rollupConfig` labeled by properties.
- `main` - Options used by default for all bundles.


## Page Builder support

Admin panel Theme Editor has `Page Builder` tab which allows users to modify layout, change text or images. This feature works only with standard `Blocks` - React components designed for a single purpose: Image Block, Text Block, etc.  
It doesn't impose any restrictions on how you build your Theme. You still can write any JSX code, but if you want, for example, some image to be modifiable in the Page Builder, you need to use Image Block.  

Let's look into example:

```tsx title="src/pages/index.tsx"
import { TCromwellPage } from '@cromwell/core';
import { CContainer, CHTML, CImage, CText } from '@cromwell/core-frontend';
import React from 'react';

const HomePage: TCromwellPage = () => (
  <CContainer id="home_0">
    <CText id="home_1">`User can edit this text`</CText>
    <CImage id="home_2" src="/themes/you-theme-name/modifiable-image.jpg" />
    <CHTML id="home_3">
      <div>
        <p>`User can edit this text and all HTML tags inside CHTML Block`</p>
      </div>
    </CHTML>
    <CContainer id="home_4">
      <p>`User will NOT be able to edit this text, but he can drag or delete`</p>
      <p>`this CContainer with everything inside it`</p>
      <img src="/themes/you-theme-name/non-modifiable-image.jpg" />
    </CContainer>
  </CContainer>
)

export default HomePage;
```

We put elements into `CContainer`s. This component equals to `<div>` tag plus properties available to all Blocks: 
- Draggable - User can drag and drop Block into another position inside any other CContainer.
- Modifiable - User can edit properties of Block. Properties can be common such as styles and Block type-specific such as 'image path' for `CImage` Block. 
- Removable - User can delete Block. Component will remain in the code since we cannot edit files of your Theme, but it will render `<></>` instead of its content.

:::important
You must always provide unique `id` prop to Blocks. We need it to keep in sync user's and Theme author's changes.  
For example, user has modified some Block and then author made a new release where he modified the same Block as well. After Theme update we'll have to match differences and override author's modifications by user's.  
:::


## Configure pages

You can apply some custom configurations to your pages in `cromwell.config.js`. The config has `pages` property which is array of page configs. CLI template has already added there home page config.  

### Page config properties:
- **`id`** - Unique id of the page. Required. We need it to recognize pages, since `route` can be changed for [Generic pages](#generic-pages).
- **`route`** - Page's route. Required. Usually it has the same value as Next.js file-routing. For example, if you have created file: `info/contacts.tsx`, then your page will be served at `info/contacts` by Next.js, so `route` value will be `info/contacts`. If your page is dynamic, for example `product/[slug].tsx`, then value is `product/[slug]`. There's one exception with the Home page, we use `index` value for it.
- **`name`** - Name of the page displayed in Theme Editor sidebar.
- **`title`** - Meta title (SEO). Cromwell CMS will automatically import Head component from `next/head` package for the title to work in frontend. But you also can use `next/head` in your code. Note that `title` from the page config overrides title in your React component.
- **`description`** - Meta description (SEO).
- **`headHtml`** - Custom HTML injected in the head. After Pre-build phase your pages will be wrapped by our root component to make these injections. 
- **`footerHtml`** - Custom HTML injected at the end of the page.
- **`modifications`** - Modifications of Blocks. Part of Page builder system. All custom modifications for Blocks (such as dragging, styling) are stored as JSON configs in `modifications`. There are two types of them: author's and user's. Author's modifications stored in `cromwell.config.js` under this property. User's modifications stored in database.  
In actual usage your modification from the config will be merged and overwritten by user's modification from DB. 
When you are making a Theme you can copy modifications from DB into this property. 
It makes possible to create a Theme using Page builder (which is not recommended since Page builder doesn't have yet advanced features to make a responsive layout) and it would be fully customizable by user.  
`modifications` property is a flat array of objects (modifications). [See TCromwellBlockData for details](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/blocks.ts#L81). Main properties: 
  - **id**`: string` - Block id, unique on the page
  - **type**`: string` - Block type, one of following: 'container', 'plugin', 'text', 'HTML', 'image', 'gallery', 'list', 'link'  
  - **isVirtual**`: boolean` - If true, indicates that this Block was created in Page builder and it doesn't exist in source files as React component. Exists only in page's config. 
  - **parentId**`: string` - Id of a parent container Block.
  - **index**`: number` - Desirable index (order) inside children array of parent element 
  - **style**`: React.CSSProperties` - CSS styles to apply to this block's wrapper. In a format of React CSS properties
  - **isDeleted**`: boolean` - Non-virtual blocks that exist in JSX cannot physically be deleted in Theme's source code by user, but user can set isDeleted flag that will tell this Block to render nothing instead of original content.
  - **global**`: boolean`

:::note
It is not necessary to add configs for your pages, and you can start development even without `cromwell.config.js` file, but if you want your page to work in Admin panel Theme Editor, you have to add a page config for it with at least `id` and `route` properties.
:::

### Default pages

`cromwell.config.js` has `defaultPages` property that tells Admin panel where to find your pages. For example, in a product page of Admin panel at the top right menu you can see icon with tooltip "open product page in the new tab". The icon opens same product in frontend page of an active Theme. Since it's possible for Theme author to place product page under any route, you need to specify its route in the `defaultPages` for Admin panel links to work.  

All available Default pages with route examples:
```json
{
  "category": "category/[slug]",
  "product": "product/[slug]",
  "post": "post/[slug]",
  "tag": "tag/[slug]",
  "pages": "pages/[slug]",
  "account": "account",
  "checkout": "checkout",
}
```

## Use Plugins

Plugins unlike other blocks can only be added in the page config. In order to retrieve static props of Plugins on server we need to know what Plugins used on pages before executing them.  
So in your page you can add a container:
```tsx
<CContainer id="some-plugin-container"></CContainer>
```
And add Plugin to the `modifications` of a [page config](#page-config-properties): 
```json
{
  "type": "plugin",
  "id": "some-plugin-id",
  "parentId": "some-plugin-container",
  "isVirtual": true,
  "plugin": {
    "pluginName": "some-plugin-package-name"
  }
}
```

## Generic pages

User can create a new page in the Theme Editor. Since there's no way to add Next.js pages at runtime, this feature achieved via adding a dynamic page at `pages/[slug]` route. If your Theme doesn't export component at `src/pages/pages/[slug].(jsx|tsx)`, then it will be generated internally at pre-build phase, but you're encouraged to create it yourself, since probably you want to have it the same layout as in other pages.  

Theme author also can create a generic page in the Theme config. Just add a page config with the route: `pages/your-page-name` and put modifications to display some content.  

The difference of generic pages from other pages that they can have a different page config for a specified slug, while, for example, `/product/[slug]` page will have the same config for every provided slug.


## Publish

Any Theme or Plugin is an NPM package. That's how Cromwell CMS recognizes and manages them. If you want to share your Theme/Plugin you need to publish it as NPM package.

First configure info that will be displayed in Admin panel. Open `package.json` > `cromwell` property > modify fields: `title`, `image`, `excerpt`, `description`, `author`. [More about `package.json` config](/docs/development/module-config)  

Check that all needed directories are included in your npm package. They should be set as "files" in your package.json:
```json title="package.json"
"files": [
  "build",
  "static",
  "cromwell.config.js"
], 
```  
Do not include `.cromwell` and `public` directories, these are CMS runtime directories.   

Make sure you have successfully built your Theme/Plugin.  
For a Theme `./build` directory should contain `.next` and if there any Admin panel pages - `theme/admin`.  
For a Plugin `./build` directory should reflect `src` 3 main directories. 
Your Theme/Plugin also should work locally at http://localhost:4016/

Publish your package to the npm registry:
```bash
npm publish --access public
```

### Publish in the Cromwell CMS market

For your Theme/Plugin to appear in the Admin panel market at `/admin/#/theme-market` page, we need to add it in our central database. For now there's no automatic process and all new Modules checked manually (to ensure build correctness and acceptable code quality), so please reach us for publication at cromwellcms@gmail.com.  
Publication is free.

## Install

You can install your Theme/Plugin from the CMS market in the GUI of Admin panel or from npm registry in the terminal.

### Install from npm registry

Install in existing/running project, or create a new basic project:
```bash
npx @cromwell/cli create my-website
```

Install your Theme:
```bash
npm i my-theme-name -S
```

You don't have to restart CMS, your Theme will be found and displayed in the Admin panel. Now you can set it as active to see at the frontend.  