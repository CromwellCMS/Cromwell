---
sidebar_position: 2
---

# Plugin development

Cromwell CMS Plugins are JavaScript modules that can extend functionality of a Theme, Admin panel or API server. They follow specific structure and are built with CMS CLI tools. Unlike with Themes there's no Next.js involved in the build process. Although Plugin's frontend follows principles of Next.js pages, so if you are not familiar with Next.js, [you should definitely start with it first](https://nextjs.org/docs/getting-started).    


### Create a project

As in the [Installation guide](/docs/overview/installation#4-cromwell-cli), Cromwell CLI can create a new project template. Use `--type theme` argument if you want to create Theme or `--type plugin` for Plugin.  
```bash
npx @cromwell/cli create --type plugin my-plugin-name
```

### Project structure

- **`cromwell.config.js`** - [Config file for your Theme/Plugin.](/docs/development/module-config)  
- **`src`** - Directory for source files.
- **`static`** - Directory for static files (images). Files from this directory will be copied into `public` directory of the CMS, from where they will be served by our server to the frontend. You can access your Plugin files through the following pattern: `/plugins/${packageName}/${pathInStaticDir}`.  
Image example:  `<img src="/plugins/@cromwell/plugin-newsletter/icon_email.png" />`

From your source directory will be built 3 different bundles designed for a specific place of the CMS to work. So `src` directory is divided into 3 main subdirectories:
- **`src/admin`** - Directory for Admin panel bundle.
- **`src/backend`** - Directory for API server bundle.
- **`src/frontend`** - Directory for frontend (Theme) bundle.

All subdirectories are not required. For example, your Plugin can be utilized only in Admin panel, but not by Theme frontend.  

Bundles are going to be produced by requiring your directory (if it exists) such as: `require('src/admin')`. Which means any directory should have `index.(js|jsx|ts|tsx)` file.  
Any further project structure is up to you. CMS bundler will look for `src/admin/index.ts`, but you can have as many files/directories as you want in `src/admin`.  


## Admin

The purpose of the Admin bundle is to register widgets that will be used in specific places of Admin panel. Widget is any valid React component.   
You can look into [newsletter plugin](https://github.com/CromwellCMS/Cromwell/blob/master/plugins/newsletter/src/admin/index.tsx) as an example.

If you want your Plugin to have its own page in Admin panel > Plugins, you need to register the settings page:

```tsx title="src/admin/index.tsx"
import { TPluginSettingsProps } from '@cromwell/core';
import { registerWidget } from '@cromwell/core-frontend';
import React from 'react';

function SettingsPage(props: TPluginSettingsProps) {
  return (
    <div>
      <h1>`Hello Admin Panel!`</h1>
      <p>{props.pluginName}</p>
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
Plugin component will receive [its settings](#plugin-settings) in `pluginSettings` prop. 
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

For now, amount of available widgets is quite small, but we will add much more in future releases!


## Plugin settings

Plugin settings are any valid JSON. There are two types of settings: `Plugin settings` and `Instance settings`

### Plugin global settings

Plugin's global settings passed in `pluginSettings` prop of a SettingsPage and context of `getStaticProps` in [frontend component](#frontend). It is Plugin's main configuration object. It is stored in the database as text (serialized JSON) for each Plugin.     
To save/load data you can use frontend API client:

```tsx title="src/admin/index.tsx"
import { TPluginSettingsProps } from '@cromwell/core';
import { getRestApiClient } from '@cromwell/core-frontend';
import React from 'react';

type MySettingsType = {
  someSettingsProp: string | undefined;
}

function SettingsPage(props: TPluginSettingsProps<MySettingsType>) {
  (async () => {
    await getRestApiClient().savePluginSettings('your-plugin-name', {
      someSettingsProp: 'test1'
    });

    const settings: MySettingsType = await getRestApiClient().getPluginSettings('your-plugin-name');
    console.log(settings.someSettingsProp); // "test1" 
  })();

  return (
    <p>{props.pluginSettings.someSettingsProp ?? 'unset'}</p>
  )
}

registerWidget({
  pluginName: 'your-plugin-name',
  widgetName: 'PluginSettings',
  component: SettingsPage
});
```

:::note
Plugin settings are private and visible only for administrators.  
Server will reject `getPluginSettings` or `savePluginSettings` request if it called from unauthenticated client or logged user does not have `Administrator` role (unauthorized). 
:::

### Instance settings
Instance settings passed in `instanceSettings` prop of a [frontend component](#frontend) are local settings that can be passed from Admin Panel Theme Editor per placed Plugin (and user can place your Plugin many times on different pages), or they are passed directly to the Plugin Block in Theme's JSX code:

```tsx title="my-theme/src/pages/index.tsx"
import { CPlugin } from '@cromwell/core-frontend';
import React from 'react';

export default function HomePageOfSomeTheme() {
  const onFilterChange = () => console.log('filter changed');
  
  return (
    <CPlugin
      id="product-filter-plugin"
      pluginName="@cromwell/plugin-product-filter"
      plugin={{
        instanceSettings: {
          disableMobile: true,
          onChange: onFilterChange,
        }
      }}
    />
  )
}
```

### Settings default interface

Admin panel has a set of components that can help you to build admin panel interface. Moreover standard interface can make an interface of all Plugins to be intuitively comprehensive for a user which results in better UX.  

One main component amidst them all is `PluginSettingsLayout` which creates a default settings interface. It allows you to easily make an interface for modifications and saving of Plugin's settings.
To use a default interface for your Plugin import `PluginSettingsLayout` React component and use it this way:

```tsx title="src/admin/index.tsx"
import { PluginSettingsLayout, TextFieldWithTooltip } from '@cromwell/admin-panel';
import { TPluginSettingsProps } from '@cromwell/core';
import React from 'react';

type TSettings = {
  mySettingProp: string;
}

export function SettingsPage(props: TPluginSettingsProps<TSettings>) {
  const onSave = () => {
      // Do something on Save button click
  }
  return (
    <PluginSettingsLayout<TSettings> {...props} onSave={onSave}>
      {({ pluginSettings, changeSetting }) => {
        return (
          <TextFieldWithTooltip 
            label="My setting"
            tooltipText="My setting tooltip..."
            value={pluginSettings?.mySettingProp ?? ''}
            style={{ marginBottom: '15px', marginRight: '15px', maxWidth: '450px' }}
            onChange={e => changeSetting('mySettingProp', e.target.value)}
          />
        )
      }}
    </PluginSettingsLayout>
  )
}
```

Note that your settings won't be saved into the database on calling `changeSetting`. They only will be saved when user presses `Save` button provided by `PluginSettingsLayout` component. 


### Clearing frontend cache

Frontend Themes usually built using Next.js SSG pages. This feature in Next.js uses caching to make serving faster. Different Themes can set different [lifetime of a cache in `revalidate` property](https://nextjs.org/docs/basic-features/data-fetching#incremental-static-regeneration), but generally it means that after updating data in the database at least for some time Next.js can possibly serve outdated pages. To avoid this internally in the Cromwell CMS we always purge the cache when data updated/deleted. If you use default API client and update, for example, a product, then cache will be purged automatically and all pages updated.   
But if you are making a Plugin that has a frontend part dependent on some settings from database or any other place, then you need to purge cache manually. Such request can be performed from default API client by calling `purgeRendererEntireCache` property. Note that this request requires administrator privileges.  

For example if you want to purge the cache when a user (admin logged in the admin panel) modified settings of your Plugin:

```tsx title="src/admin/index.tsx"
import { PluginSettingsLayout, TextFieldWithTooltip } from '@cromwell/admin-panel';
import { TPluginSettingsProps } from '@cromwell/core';
import { getRestApiClient } from '@cromwell/core-frontend';
import React from 'react';

export function SettingsPage(props: TPluginSettingsProps) {
  const onSave = () => {
    getRestApiClient().purgeRendererEntireCache();
  }
  return (
    <PluginSettingsLayout<TSettings> {...props} onSave={onSave}>
      {({ pluginSettings, changeSetting }) => {
        return (
          <>
          {/* 
            <TextFieldWithTooltip
              ...
            /> */}
          </>
        )
      }}
    </PluginSettingsLayout>
  )
}
```

### Instance settings editor

When user creates Plugin block on a page in Admin Theme Editor, it's possible for user to modify specific configuration for this block. Configuration object and UI are defined by Plugin. As with global Plugin settings, you need to register a widget that will handle instance settings:


```tsx title="src/admin/index.tsx"
import { registerWidget } from '@cromwell/core-frontend';
import { registerWidget, WidgetTypes } from '@cromwell/core-frontend';
import React from 'react';

function ThemeEditor(props: WidgetTypes['ThemeEditor']) {
  return (
    <div>
      <h1>`Hello Theme Editor!`</h1>
    </div>
  )
}

registerWidget({
    pluginName: 'your-plugin-name',
    widgetName: 'ThemeEditor',
    component: ThemeEditor
});
```

Instance settings are loaded and saved via passed props. Your ThemeEditor widget will receive following props:
- instanceSettings`: any` - Instance settings
- changeInstanceSettings`: (data: any) => void` - Call this function to modify instance settings. Note that settings will actually be saved when user will press "save" button at the top of Theme Editor.
- block`: TCromwellBlock` - Block instance component on the page
- modifyData`: (data: TCromwellBlockData) => void` - Method to modify block's data (TCromwellBlockData). Block's data can be retrieved from block instance via:  `block.getData()`. Note, that block is a generic definition, it can be text block, image block, etc. Configuration for plugin stored in: `block.getData().plugin`
- deleteBlock`: () => void` - Call this method if you want to delete block from the page.
- addNewBlockAfter`: (bType: TCromwellBlockType) => void` - You can add new block on the page right after current plugin block. Specify block type.

With loading and saving settings example will be as follows:

```tsx title="src/pages/index.tsx"
import { TextFieldWithTooltip } from '@cromwell/admin-panel';
import { registerWidget, WidgetTypes } from '@cromwell/core-frontend';
import React from 'react';

export function ThemeEditor(props: WidgetTypes['ThemeEditor']) {
  const handleChangeSetting = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.changeInstanceSettings?.(Object.assign({}, props.instanceSettings, {
      mySetting: event.target.value,
    }));
  }

  return (
    <TextFieldWithTooltip 
      label="My custom text setting"
      tooltipText="Change me"
      value={props.instanceSettings.mySetting ?? ''}
      onChange={handleChangeSetting}
    />
  )
}

registerWidget({
  pluginName: 'your-plugin-name',
  widgetName: 'ThemeEditor',
  component: ThemeEditor
});
```

## Frontend

Frontend bundle follows the principles of Next.js pages. You have to export a React component and optionally you can use `getStaticProps`.  

```tsx
import { TGetPluginStaticProps, TFrontendPluginProps } from '@cromwell/core';

type DataType = {
  message: string;
  globalSettings: {
    someGlobalSettingsProp: string;
  }
}

type MyLocalSettingsType = {
  someLocalSettingsProp: string;
}

type MyGlobalSettings = {
  someGlobalSettingsProp: string;
  secretKey: string;
}

export default function YouPluginName(props: TFrontendPluginProps<DataType, MyLocalSettingsType>) {
  return (
    <>
      <div>{props.data?.message}</div>
      <div>{props.data?.globalSettings?.someGlobalSettingsProp}</div>
      <div>{props.instanceSettings?.someLocalSettingsProp}</div>
    </>
  )
}

export const getStaticProps: TGetPluginStaticProps<MyGlobalSettings> = async (context): Promise<DataType> => {
  // Filter out private data at the backend
  const { secretKey, ...restSettings } = context.pluginSettings;
  // And pass the rest to the frontend
  return {
    message: 'Hello world',
    globalSettings: restSettings,
  }
}
```

`getStaticProps` here works the same way as in Next.js pages. Cromwell CMS will collect props for all Plugins on the requested page and pass them to components. This means your plugin can be statically pre-rendered with all the data at the Next.js server.  

Plugin's settings will be passed to `getStaticProps` in the context. Since this function is executed only at the backend, you can safely extract your private settings and pass others to the frontend as data.

Note that a user can possibly drop your Plugin several times at one page. But `getStaticProps` will be called only once at the page! Therefore `props.data` passed to the React components will be the same for all instances.  
If you have custom instance settings and you want to fetch different data for a specific Plugin instances in `getStaticProps`, you can access `context.pluginInstances`. This object contains settings for each Plugin instance (if these settings were passed) labelled by block id. Block id is a unique id of every Block on the page like CPlugin. You can access block id at the frontend via `props.blockId`. So your solution in this case will be like that:

```tsx
import { TGetPluginStaticProps, TFrontendPluginProps } from '@cromwell/core';

type DataType = {
  myData: {
    blockId: string;
    instanceData: string;
  }[];
}

export default function YouPluginName(props: TFrontendPluginProps<DataType>) {
  return (
    <>
      <p>Data of this plugin instance:</p>
      <div>{props.myData?.find(data => data.blockId === props.blockId)?.instanceData}</div>
    </>
  )
}

export const getStaticProps: TGetPluginStaticProps = async (context): Promise<DataType> => {
  if (context.pluginInstances) {
    return {
      myData: await Promise.all(Object.keys(context.pluginInstances).map(async blockId => {
        const data = await fetchMyCustomDataByInstanceSettings(context.pluginInstances[blockId])
        return {
          blockId,
          instanceData: data,
        }
      }))
    }
  }
}
```


## Backend

Backend bundle is a module that will be executed on API server. The server will include your module's exports. These specific exports are called extensions.

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

Basically, all systems listed above: TypeORM, TypeGraphQL, Nest.js are designed to initialize all entities/resolvers/controllers at server startup. Updating classes at runtime may lead to problems such as wrong type reflection (for example, if some plugin has updated a class in a new release). Another problem is that we cannot have an outage of production server during such update.  
In Cromwell CMS we have a feature called "safe reload". After Plugin installation/update we start a new server instance at next available port. If startup was successful, we redirect traffic to the new instance and kill old one after timeout. If installation/update was not successful, then we remove the Plugin, no server restart will follow. From an outside point of view, there's zero downtime for API server in both cases.
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

### Entities and Migrations

If your Plugin adds new TypeORM Entities, it should change database schema. To easily work in development we can use TypeORM's `"synchronize": true` [connection option](https://typeorm.io/#/connection-options) with SQLite database. SQLite used by default, to enable "synchronize" for it, create `cmsconfig.json` file in the project root:
```json title="cmsconfig.json"
{
  "env": "dev"
}
```
Now when you start the CMS via `npx cromwell start`, server will update database's schema according to your entities.

:::note
Using `npx cromwell start` in development may appear slow if you want, for example, only to restart API server. In this case, you can manage services separately in different terminals:
- `npx crw s --sv s` - To start API server.
- `npx crw s --sv a` - To start Admin panel.
- `npx crw s --sv r` - To start Frontend (Next.js) server.
:::

After your Plugin will be installed, we need to update user's database since user's CMS will be in a production environment with disabled "synchronize". [Migrations](https://typeorm.io/#/migrations) are designed for such updates. You can write your custom migrations and export them as `migrations` extension in `src/backend/index.ts` file.   
Important to know that these migrations can potentially run in all supported types of databases: SQLite/MySQL/Postgres. So SQL syntax must be universal. Or you can check database type in connection options and write conditional queries.

To simplify creation of such migrations, there's the suggested workflow:
1. In your project root create files with TypeORM connection options per each target database:
  - [`migration-mysql.json`](https://github.com/CromwellCMS/Cromwell/blob/master/plugins/newsletter/migration-mysql.json)
  - [`migration-postgres.json`](https://github.com/CromwellCMS/Cromwell/blob/master/plugins/newsletter/migration-postgres.json)
  - [`migration-sqlite.json`](https://github.com/CromwellCMS/Cromwell/blob/master/plugins/newsletter/migration-sqlite.json)
2. Add following scripts to your package.json (we use %npm_config_name%" on Windows, on Linux you need to change it to $npm_config_name"):
```json title="package.json"
"scripts": {
  "build": "npx cromwell b",
  "watch": "npx cromwell b -w",
  "docker:start-dev-mariadb": "docker run -d -p 3306:3306 --name crw-mariadb -e MARIADB_ALLOW_EMPTY_ROOT_PASSWORD=true -e MARIADB_DATABASE=cromwell -e MYSQL_USER=cromwell -e MYSQL_PASSWORD=my_password mariadb:latest",
  "docker:start-dev-postgres": "docker run -d -p 5432:5432 --name crw-postgres -e POSTGRES_DB=cromwell -e POSTGRES_USER=cromwell -e POSTGRES_PASSWORD=my_password postgres",
  "migration:generate:mysql": "npx typeorm migration:generate -o -f migration-mysql -n %npm_config_name%",
  "migration:generate:postgres": "npx typeorm migration:generate -o -f migration-postgres -n %npm_config_name%",
  "migration:generate:sqlite": "npx typeorm migration:generate -o -f migration-sqlite -n %npm_config_name%",
  "migration:generate:all": "npm run migration:generate:mysql --name=%npm_config_name% && npm run migration:generate:postgres --name=%npm_config_name% && npm run migration:generate:sqlite --name=%npm_config_name%",
  "migration:generate:all-example": "npm run migration:generate:all --name=init"
}
```
3. Build your plugin: `npm run build`
4. Launch development databases: `npm run docker:start-dev-mariadb` and `npm run docker:start-dev-postgres`
5. Generate migrations: `npm run migration:generate:all --name=init`

TypeORM will generate different migrations per database type. Migrations will be in their named directories. Cromwell CMS is already configured to look into them and execute accordingly to database type.   Directory namings should be exactly the same as configured in provided example files: `./migrations/${dbType}`. 
MySQL and MariaDB use the same directory: `./migrations/mysql`  

Don't forget to include the directory in your `files`, so migrations will be distributed along with your npm package:
```json title="package.json"
"files": [
  "build",
  "static",
  "migrations",
  "cromwell.config.js"
], 
``` 

## Compile

To transpile code and turn it into the format that can be imported by the CMS, you have to build it. Same as in [Theme development](/docs/development/theme-development#compile) use Cromwell CMS CLI:
```bash
npx cromwell build
```

Or start watcher:
```bash
npx cromwell build -w
```

Go to Admin panel and make sure your Plugin appeared at `/admin/plugins` page.  
The settings icon should open `PluginSettings` widget.

## Customize bundler

We use Rollup under the hood to build Plugins. Configurations set in `cromwell.config.js` [similar to Themes](/docs/development/theme-development#customize-bundler), but there are more types of options:
- `main` - Options used by default for all bundles.
- `adminPanel` - Options that replace main only for Admin panel bundles.
- `frontend` - Options for frontend bundle.
- `backend` - Options for backend bundle.

:::important
All bundles built with these options will be executed as-is. So you have to apply appropriate optimizations such as code minification (terser) and transpilation to older versions of JavaScript like ES5 via Babel/Typescript compiler in the `cromwell.config.js`.
:::

## Publish

[Publishing/installation process is the same as in Theme development](/docs/development/theme-development#publish)