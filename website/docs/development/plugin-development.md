---
sidebar_position: 2
---

# Plugin development

Cromwell CMS Plugins are JavaScript modules that can extend functionality of a Theme, Admin panel or API server. They follow specific structure and built with CMS CLI tools. Unlike with Themes there's no Next.js involved in the build process. Although Plugin frontend follows principles of Next.js pages, so if you are not familiar with Next.js, [you should definitely start with it first](https://nextjs.org/docs/getting-started).    


### Create a project

As in the [Installation guide](/docs/overview/installation#4-cromwell-cli), Cromwell CLI can create a new project template. Use `--type theme` argument if you want to create Theme or `--type plugin` for Plugin.  
```bash
npx @cromwell/cli create --type plugin my-plugin-name
```

### Project structure

- **`cromwell.config.js`** - [Config file for your Theme/Plugin.](/docs/development/module-config)  
- **`src`** - Directory for source files of modules.
- **`static`** - Directory for static files (images). Files from this directory will be copied into `public` directory of the CMS, from where they will be served by our server to the frontend. You can access your Plugin files through the following pattern: `/plugins/${packageName}/${pathInStaticDir}`.  
Image example:  `<img src="/plugins/@cromwell/plugin-newsletter/icon_email.png" />`

From your source directory will be built 3 different bundles designed for a specific place of the CMS to work. Accordingly `src` directory divided into 3 main subdirectories:
- **`src/admin`** - Directory for Admin panel bundle.
- **`src/backend`** - Directory for API server bundle.
- **`src/frontend`** - Directory for frontend (Theme) bundle.

All subdirectories are not required. For example, your Plugin can be utilized only in Admin panel, but not by Theme frontend.  

Bundles are going to be produced by requiring your directory (if it exists) as: `require('src/admin')`. Which means any directory should have `index.(js|jsx|ts|tsx)` file.  
Any further project structure is up to you. CMS bundler will look, for example, only in `src/admin/index.ts`, but you can have as many files/directories as you want  in `src/admin`.  


## Admin

Purpose of the Admin bundle is to register widgets that will be used in specific places of Admin panel. Widget is any valid React component.   
You can look into [newsletter plugin](https://github.com/CromwellCMS/Cromwell/blob/master/plugins/newsletter/src/admin/index.tsx) as an example.

If you want your Plugin to have its own page in Admin panel > Plugins, you need to register the settings page:

```tsx title="src/admin/index.tsx"
import { PluginSettingsProps, registerWidget } from '@cromwell/core-frontend';

type MySettingsType = {
  someProp: string;
}

function SettingsPage(props: PluginSettingsProps<MySettingsType>) {
  return (
    <div>
      <h1>Hello Admin Panel!</h1>
      <p>{props.globalSettings.someProp}</p>
    </div>
  )
}

registerWidget({
    pluginName: 'your-plugin-name',
    widgetName: 'PluginSettings',
    component: SettingsPage
});
```
:::note
Plugin will receive [its settings](#plugin-settings) in `globalSettings` prop.
:::

`registerWidget` accepts:
- `pluginName` - package.json name of your Plugin
- `widgetName` - a place of Admin panel where you want to display it.
- `component` - React component
 
All available places you can use in `widgetName`: 
- `PluginSettings` - Settings page of you plugin. 
- `Dashboard` - Draggable dashboard widget. You can set its size as a [grid item](https://github.com/react-grid-layout/react-grid-layout#grid-item-props) in React-Grid-Layout. [See the example](https://github.com/CromwellCMS/Cromwell/blob/master/plugins/newsletter/src/admin/Dashboard.tsx)
- `PostActions` - Widget to display near 'Save' button at Post page.
- `TagActions` - Widget to display near 'Save' button at Tag page.
- `ProductActions` - Widget to display near 'Save' button at Product page.
- `CategoryActions` - Widget to display near 'Save' button at Category page.
- `OrderActions` - Widget to display near 'Save' button at Order page.

For now amount of available widgets is quite small, but we will add much more in future releases!


## Plugin settings

Plugin settings is any valid JSON. It is stored in the database as text (serialized JSON) for each Plugin.     
To save/load data you can use frontend API client:

```tsx
import { getRestAPIClient } from '@cromwell/core-frontend';

(async () => {
  await getRestAPIClient().savePluginSettings('your-plugin-name', {
    someSettingsProp: 'test1'
  });

  const settings = await getRestAPIClient().getPluginSettings('your-plugin-name');
  console.log(settings.someSettingsProp) // "test1" 
})();
```

:::note
Server will reject `savePluginSettings` request if it called from unauthenticated client or logged user doest not have `Administrator` role (unauthorized). 
:::


## Backend

Backend bundle is a module that will be executed in API server.