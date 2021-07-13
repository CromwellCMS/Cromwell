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

From your source directory will be built 3 different bundles designed for a specific place of the CMS to work. So `src` directory divided into 3 main subdirectories:
- **`src/admin`** - Directory for Admin panel bundle.
- **`src/backend`** - Directory for API server bundle.
- **`src/frontend`** - Directory for frontend (Theme) bundle.

All subdirectories are not required. For example, your Plugin can be utilized only in Admin panel, but not by Theme frontend.  

Bundles are going to be produced by requiring your directory (if it exists) as: `require('src/admin')`. Which means any directory should have `index.(js|jsx|ts|tsx)` file.  
Any further project structure is up to you. CMS bundler will look for `src/admin/index.ts`, but you can have as many files/directories as you want in `src/admin`.  


## Admin

Purpose of the Admin bundle is to register widgets that will be used in specific places of Admin panel. Widget is any valid React component.   
You can look into [newsletter plugin](https://github.com/CromwellCMS/Cromwell/blob/master/plugins/newsletter/src/admin/index.tsx) as an example.

If you want your Plugin to have its own page in Admin panel > Plugins, you need to register the settings page:

```tsx title="src/admin/index.tsx"
import { TPluginSettingsProps } from '@cromwell/core';
import { registerWidget } from '@cromwell/core-frontend';

type MySettingsType = {
  someProp: string;
}

function SettingsPage(props: TPluginSettingsProps<MySettingsType>) {
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
- `pluginName` - Package.json name of your Plugin
- `widgetName` - A place of Admin panel where you want to display it.
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
Server will reject `savePluginSettings` request if it called from unauthenticated client or logged user does not have `Administrator` role (unauthorized). 
:::


## Backend

Backend bundle is a module that will be executed on API server.  

To extend server's functionality your module can export extensions:

```ts title="src/backend/index.ts"
import { TBackendModule } from '@cromwell/core-backend';

const backendModule: TBackendModule = {
  resolvers: [],
  controllers: [],
  entities: [],
  migrations: [],
}

export default backendModule;
```

[Or see the example](https://github.com/CromwellCMS/Cromwell/blob/master/plugins/newsletter/src/backend/index.ts)  

All available properties (extensions): 
- `resolvers` - [TypeGraphQL resolvers](https://typegraphql.com/docs/resolvers.html). You can write your custom resolvers to extend GraphQL API.
- `controllers` - [Nest.js controllers](https://docs.nestjs.com/controllers). You can write your custom controllers to extend REST API.
- `entities` - [TypeORM entities](https://typeorm.io/#/entities). Your Plugin can add and use new tables in the database. Note that you need to write migrations to create or modify tables, there's no 'synchronize schema' mode in the production environment.
- `migrations` - [TypeORM migrations](https://typeorm.io/#/migrations). They will be checked upon system startup and Plugin installation/update.


:::note
#### How exported extensions will be applied in the production server?

Basically all systems listed above: TypeORM, TypeGraphQL, Nest.js are designed to initialize all entities/resolvers/controllers at server startup. Updating classes at runtime may lead to problems such as wrong type reflection (for example, if some plugin has updated a class). Another problem is that we cannot have outage of production server during such update.  
In Cromwell CMS we have a feature called "safe reload". After Plugin install/update we start a new server instance at next available port. If startup was successful, we redirect traffic to the new instance and kill old one after timeout. If it's not successful, then we remove the Plugin, no restart will follow. From outside view there's zero downtime for API server in both cases.
:::

### Backend actions

Backend actions (hooks) are functions that can be triggered by certain events.  
Example:

```ts title="src/backend/index.ts"
import { getLogger, PostRepository, registerAction } from '@cromwell/core-backend';
import { getCustomRepository } from 'typeorm';

registerAction({
  pluginName: 'your-plugin-name',
  actionName: 'install_plugin',
  action: (payload) => {
    if (payload.pluginName === 'your-plugin-name') {
      getLogger().info('Thanks for installing our plugin!');
    }
  }
});

registerAction({
  pluginName: 'your-plugin-name',
  actionName: 'update_post',
  action: (payload) => {
    getLogger().warn('Updated post: ' + JSON.stringify(payload));

    // Custom logic to process Post after update.
    const post = await getCustomRepository(PostRepository).getPostById(payload.id);
    post.title += ' custom title modification';
    await post.save();
  }
});

```

`registerAction` accepts:
- `pluginName` - Package.json name of your Plugin
- `actionName` - Name of a hook to subscribe. [See all available](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/backend/src/helpers/types.ts#L22)
- `action` - Function to run. It will receive different payloads depending on action type.

### Custom actions

It's also possible to register and fire custom actions, if you want, for example, to use them in different plugins:
```ts title="src/backend/index.ts"
registerAction<any, { data: string }>({
  pluginName: 'your-plugin-name',
  actionName: 'your-plugin-name-custom_action',
  action: (payload) => {
    console.log(payload.data)
  }
});

fireAction<any, { data: string }>({
  actionName: 'your-plugin-name-custom_action',
  payload: { data: 'test1' }
})
```

## Frontend

Frontend bundle follows principles of Next.js pages. You have to export a React component and optionally you can use `getStaticProps`.  

```tsx
import { TGetStaticProps, TFrontendPluginProps } from '@cromwell/core';

type DataType = {
  message: string;
}

export default function YouPluginName(props: TFrontendPluginProps<DataType>) {
  return (
    <div>{props.data.message}</div>
  )
}

export const getStaticProps: TGetStaticProps = async (context): Promise<DataType> => {
  return {
    message: 'Hello world'
  }
}
```

`getStaticProps` works in the same way as in Next.js pages. Cromwell CMS root wrapper will collect props for all Plugins at the requested page and pass them. Which means your plugin will be statically pre-rendered with data at the Next.js server.  


## Compile

To transpile code and turn it into the format that can be imported by the CMS, you have to build it. Same as in [Theme development](/docs/development/theme-development#compile) use Cromwell CMS CLI:
```bash
npx cromwell build
```

Or start watcher:
```bash
npx cromwell build -w
```

Go to Admin panel and make sure your Plugin appeared at /admin/#/plugins
Settings icon should open `PluginSettings` widget.

## Customize bundler

We use Rollup under the hood to build Plugins. Configurations set in `cromwell.config.js` [similar to Themes](/docs/development/theme-development#customize-bundler), but there are more types of options:
- `main` - Options used by default for all bundles.
- `adminPanel` - Options that replace main only for Admin panel bundles.
- `frontend` - Options for frontend bundle.
- `backend` - Options for backend bundle.

:::important
All bundles built with these options will be executed as is. So you have to apply appropriate optimizations such as code minification (terser) and transpilation to older versions of JavaScript like ES5 via Babel/Typescript compiler in the `cromwell.config.js`.
:::

## Publish

[Publishing process is the same as in Theme development](/docs/development/theme-development#publish)