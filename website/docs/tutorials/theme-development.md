---
sidebar_position: 1
---

# Theme development

Cromwell CMS follows principles of headless CMS where API server runs separately from its frontend server. So basically you can create any type of frontend and host it wherever you like. But in this scenario you need to manage and deploy this frontend by yourself.  
Cromwell CMS provides a way to build Themes that are managed and work with the CMS core. CMS users can easily install Themes from official market right in their Admin panel GUI, make active, delete them, change layout in the Page Builder as long as Themes follow guidelines we are going to show.  

Cromwell CMS Theme is a Next.js app. Theme development is basically Next.js development. If you are not familiar with Next.js, [you should definitely start with it first](https://nextjs.org/docs/getting-started).   


### Create a project

As in Installation post Cromwell CLI can create you a new project template. If you create a Theme you need to provide `--type theme` argument or `--type plugin` for a Plugin.  
```sh
npx @cromwell/cli create --type theme my-theme-name
```

### Project structure

- `src/pages` - Directory for Next.js pages. There's `index.tsx` file created by CLI as default home page. You can rename it to .jsx if you don't want to work with Typescript (which is discouraged).
- `static` - Directory for static files your theme will use. Files from this directory will be copied into `public` directory of the CMS on Theme/Plugin installation/update.  
Your files in the `public` will have a path that follows the pattern: `/themes/${packageName}/${pathRelativelyStaticDir}`.  
Image example:  `<img src="/themes/@cromwell/theme-store/free_shipping.png" />`
- `cromwell.config.js` - Config file for your Theme/Plugin.  