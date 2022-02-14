# @cromwell/theme-store

> Online store theme for Cromwell CMS. One of two default themes.

## Use as a package

This theme will be installed by your package manager during default [installation of the CMS](https://cromwellcms.com/docs/overview/installation).  

Or you can add it manually: `yarn add @cromwell/theme-store -D`.   

This is production-only usage.


## Clone and develop

You don't need to clone entire CMS repository. For making a custom app on top of this theme you can download its files:

1. `npx github-directory-downloader https://github.com/CromwellCMS/Cromwell/tree/master/themes/store --dir=project-name` 
2. `cd project-name`
3. Open `package.json`, change `name` and `cromwell.title` properties.
3. `yarn install`
4. `yarn add @cromwell/theme-store -D`
4. Start the CMS in background to use API: `npx cromwell start`
5. Start theme development server: `npx cromwell build -w`
6. Open `http://localhost:4256`  

Note that you need to use `yarn`. There are troubles with resolving CMS dependencies by `npm`.