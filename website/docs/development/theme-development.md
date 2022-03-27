---
sidebar_position: 1
---

# Theme development

Cromwell CMS follows principles of headless CMS where API server runs separately from frontend server. So basically you can create any type of frontend and host it wherever you like. But in this scenario, you need to manage and deploy this frontend by yourself.  
To simply the workflow Cromwell CMS has its theming engine. Users can easily install Themes from the official market right in their Admin panel GUI, make active, delete them, change layout in the Theme Editor as long as Themes follow the guidelines we are going to show.  

Cromwell CMS Theme is a **Next.js** app. Theme development is basically Next.js development. If you are not familiar with Next.js, [you should definitely start with it first](https://nextjs.org/docs/getting-started).   


## Create a project

As in the [Installation guide](/docs/overview/installation#4-cromwell-cli), Cromwell CLI can create a new project template. Use `--type theme` argument if you want to create Theme or `--type plugin` for Plugin.  
```bash
npx @cromwell/cli create --type theme my-theme-name
```

## Project structure

- **`cromwell.config.js`** - [Optional config file for your Theme/Plugin.](/docs/development/module-config)  
- **`src/pages`** - Directory for Next.js pages. By default, there's `index.tsx` created by CLI. You can rename it to .jsx if you don't want to work with TypeScript.
- **`static`** - Directory for static files (images). Unlike `public` directory used by Next.js, `static` should be distributed with your package. After installation by end-user files from `static` directory will be copied into `public` directory of the CMS, from where they will be served to the frontend. You can access static files of your Theme through the following pattern: `/themes/${packageName}/${pathInStaticDir}`.  
Image example:  `<img src="/themes/@cromwell/theme-store/free_shipping.png" />`


## Compile

To make your Theme work with the CMS we generate wrappers and meta files. These files help to inject settings from the admin panel (that's how theme editor works) and make [Frontend dependencies](/docs/development/frontend-dependencies) sharable between plugins. With that, you cannot directly use Next.js CLI, but Cromwell CLI has a replacement that works in a similar way and invokes Next.js CLI under the hood.  

To start Next.js development server with watcher (same as `next dev`):
```bash
npx cromwell build -w
```
Or via shortcut:
```bash
npx crw b -w
```
Open [http://localhost:4256/](http://localhost:4256/) to see your website.  

When your Theme is ready and you want to try it with the CMS in production environment, your need to build it. Same as `next build` run:
```bash
npx cromwell build
```

Now you can go into Admin panel > Themes > click "Set active" on your Theme card. It will change active CMS Theme at [http://localhost:4016/](http://localhost:4016/)


## Data fetching

There are two data fetching methods: via requests to API server and via [TypeORM](https://typeorm.io/).

### API

This way is simplest and it allows you to work with GraphQL. Another advantage is that load is distributed between API server and Next.js server.   

In development you will probably need to see list of all available API methods. For that start the CMS in development mode. In your project root create `cmsconfig.json` file with the content:
```json
{
  "env": "dev"
}
```

Now start the CMS:
```bash
npx cromwell start 
```

For data flow the CMS uses GraphQL. You can see and play with requests in the [Apollo](https://www.apollographql.com/) Graph sandbox. Go to [http://localhost:4016/api/graphql](http://localhost:4016/api/graphql) and it will suggest you to start one.

Additionally there is Nest.js REST API designed for other CMS transaction. You can open swagger at [http://localhost:4016/api/api-docs](http://localhost:4016/api/api-docs)


To simplify work with API Server, CMS provides API client from `@cromwell/core-frontend` package. You can use it on client or server.  
For example, you want to render a page with 3 recent posts:  

```tsx title="src/pages/index.tsx"
import { TCromwellPage, TGetStaticProps, TPost } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';

type MyPageProps = {
    latestPosts?: TPost[];
}

const MyPage: TCromwellPage<MyPageProps> = (props) => {
    return (<>
        {props.latestPosts?.map(post => (
            <p key={post.id}>{post.title}</p>
        ))}
    </>)
}

export default MyPage;

export const getStaticProps: TGetStaticProps<MyPageProps> = async (context) => {
    const client = getGraphQLClient();
    const posts = await client.getFilteredPosts({
        pagedParams: {
            pageSize: 3,
        },
        filterParams: {
            sorts: [
                {
                    key: 'publishDate',
                    sort: 'DESC'
                }
            ]
        }
    });

    return {
        props: {
            latestPosts: posts.elements
        }
    }
}
```

In the example above `getFilteredPosts` used a default fragment for us. But if we want to leverage GraphQL we can provide a custom fragment for a Post: 

```ts
import { gql } from '@apollo/client';
import { getGraphQLClient } from '@cromwell/core-frontend';

const client = getGraphQLClient();

const posts = await client.getFilteredPosts({
    pagedParams: {
        pageSize: 3,
    },
    filterParams: {
        sorts: [
            {
                key: 'publishDate',
                sort: 'DESC'
            }
        ]
    },
    customFragment: gql`
        fragment PostListFragment on Post {
            id
            slug
            title
            createDate
            excerpt
            author {
                id
                email
                fullName
            }
            tags {
                name
            }
        }`,
    customFragmentName: 'PostListFragment',
});
```

Or we can make a completely custom request:
```ts
import { gql } from '@apollo/client';
import { getGraphQLClient } from '@cromwell/core-frontend';

const client = getGraphQLClient();

const response = await client.query({
    query: gql`
        query getFilteredPosts($pagedParams: PagedParamsInput, $filterParams: PostFilterInput) {
            getFilteredPosts(pagedParams: $pagedParams, filterParams: $filterParams) {
                pagedMeta {
                    ...PagedMetaFragment
                }
                elements {
                    id
                    isEnabled
                    slug
                    title
                    mainImage
                }
            }
        }
        ${client.PagedMetaFragment}
        `,
    variables: {
        pagedParams: {
            pageSize: 3,
        },
        filterParams: {
          sorts: [
              {
                  key: 'publishDate',
                  sort: 'DESC'
              }
          ]
      },
    }
}); 

const posts = response?.data?.getFilteredPosts?.elements;
```

You can notice that some methods of GraphQLClient create or update database records. They all require authentication. To log in on frontend use REST API client:
```ts
import { getGraphQLClient, getRestApiClient } from '@cromwell/core-frontend';

const user = await getRestApiClient().login({
    email: 'email',
    password: 'password'
});

// If user is an author or administrator you will be able to create a post:
getGraphQLClient().createPost({
    title: 'title',
    /** ... */
});
```

[See API docs](https://cromwellcms.com/docs/api/classes/frontend.CGraphQLClient) for the full list of methods.  
Also see [custom data](https://cromwellcms.com/docs/features/custom-data) about how to retrieve data of custom fields and entities.  

For Theme authors it's recommended to use API clients. If clients are not enough you can extend API server by [making Plugins](/docs/development/plugin-development#backend).  
If it's still not what you want and you are building your own app, there is a second option.

### Monolithic data fetching

This is yet-to-be-improved approach and it is disabled by default. To connect Next.js server to your database, add an option to your `cmsconfig.json` and restart the CMS 
```json title="cmsconfig.json"
{
  "monolith": true
}
```

Now you can use backend tools from `@cromwell/core-backend` or make any custom query with TypeORM.

```tsx
import { TCromwellPage, TGetStaticProps, TPost, nodeRequire } from '@cromwell/core';
declare const __non_webpack_require__: (name: string) => any; 

type MyPageProps = {
    latestPosts?: TPost[];
}

const MyPage: TCromwellPage<MyPageProps> = (props) => {
    return (<>
        {props.latestPosts?.map(post => (
            <p key={post.id}>{post.title}</p>
        ))}
    </>)
}

export default MyPage;

export const getStaticProps: TGetStaticProps<MyPageProps> = async (context) => {
    // We use __non_webpack_require__ to avoid processing heavy modules by Webpack
    // since they will be present in user backend environment anyway.
    const { getCustomRepository, getManager }: typeof import('typeorm') 
        = __non_webpack_require__('typeorm');

    const { PostRepository, Post }: typeof import('@cromwell/core-backend') 
        = __non_webpack_require__('@cromwell/core-backend');

    // Use repository methods
    const posts = await getCustomRepository(PostRepository).getFilteredPosts({
        pageSize: 3,
    }, {
        sorts: [
            {
                key: 'publishDate',
                sort: 'DESC'
            }
        ]
    });

    // Use query builder
    getManager().createQueryBuilder(Post.metadata.tablePath).select(['id'])

    // Execute raw SQL
    getManager().query('SELECT * FROM crw_post')

    return {
        props: {
            latestPosts: posts.elements
        }
    }
}
```
[See API docs](https://cromwellcms.com/docs/api/modules/backend) for all available backend classes and functions.


## Theme Editor support

Admin panel Theme Editor allows users to modify layout of blocks, change text or images, styles, etc. This feature works only with standard `Blocks` - React components designed for a single purpose: Image Block, Text Block, etc.  
It doesn't impose any restrictions on how you build your Theme. You still can write any JSX code, but if you want, for example, some image to be modifiable in the Theme Editor, you need to use Image Block.  

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
- Removable - User can delete Block. Component will remain in the code since we cannot edit files of your Theme, but it will render nothing instead of its content.

:::important
You must always provide a unique `id` prop to Blocks. We need it to keep in sync user's and Theme author's changes.  
For example, user has modified some Block and then author made a new release where he modified the same Block as well. After Theme update we'll have to match differences and override author's modifications by user's.  
:::


## Configure pages

You can apply some custom configurations to your pages in `cromwell.config.js`. The config has `pages` property which is array of page configs. CLI template has already added there home page config.  

### Page config properties:
- **`id`** - Unique id of the page. Required. We need it to recognize pages, since `route` can possibly be changed for [Generic pages](#generic-pages).
- **`route`** - Page's route. Required. Usually it has the same value as in Next.js file-routing. For example, if you have created file: `info/contacts.tsx`, then your page will be served at `info/contacts` by Next.js, so `route` value will be `info/contacts`. If your page is dynamic, for example `product/[slug].tsx`, then value is `product/[slug]`. There's one exception with the Home page, we use `index` value for it.
- **`name`** - Name of the page displayed in Theme Editor sidebar.
- **`title`** - Meta title (SEO). Cromwell CMS will automatically import Head component from `next/head` package for the title to work in the frontend. But you also can use `next/head` in your code. Note that `title` from the page config overrides title in your React component.
- **`description`** - Meta description (SEO).
- **`headHtml`** - Custom HTML injected in the head. After Pre-build phase your pages will be wrapped by our root component to make these injections. 
- **`footerHtml`** - Custom HTML injected at the end of the page.
- **`modifications`** - Modifications of Blocks. Part of Theme Editor system. All custom modifications for Blocks (such as dragging, styling) are stored as JSON configs in `modifications`. There are two types of them: author's and user's. Author's modifications stored in `cromwell.config.js` under this property. User's modifications are stored in database.  
In actual usage your modification from the config will be merged and overwritten by user's modification from DB. 
When you are making a Theme you can copy modifications from DB into this property. 
It makes it possible to create a Theme using Theme Editor (which is not recommended since Theme Editor doesn't have yet advanced features to make a responsive layout) and it would be fully customizable by user.  
`modifications` property is a flat array of objects (modifications). [See TCromwellBlockData for details](https://github.com/CromwellCMS/Cromwell/blob/master/system/core/common/src/types/blocks.ts#L81). Main properties: 
  - **id**`: string` - Block id, unique on the page
  - **type**`: string` - Block type, one of following: 'container', 'plugin', 'text', 'HTML', 'image', 'gallery', 'list', 'link'  
  - **isVirtual**`: boolean` - If true, indicates that this Block was created in Theme Editor and it doesn't exist in source files as React component. Exists only in page's config. 
  - **parentId**`: string` - Id of a parent container Block.
  - **index**`: number` - Desirable index (order) inside children array of parent element 
  - **style**`: React.CSSProperties` - CSS styles to apply to this block's wrapper. In a format of React CSS properties
  - **isDeleted**`: boolean` - Non-virtual blocks that exist in JSX cannot physically be deleted in Theme's source code by user, but user can set isDeleted flag that will tell this Block to render nothing instead of original content.
  - **global**`: boolean` - Apply this modification on all pages.

:::note
It is not necessary to add configs for your pages, and you can start development even without `cromwell.config.js` file, but if you want your page to work in Admin panel Theme Editor, you have to add a page config for it with at least `id` and `route` properties.
:::

### Default pages

`cromwell.config.js` has `defaultPages` property that tells Admin panel where to find your pages. For example, in a product page of Admin panel at the top-right menu you can see icon with the tooltip "open product page in the new tab". The icon opens the same product in frontend page of an active Theme. Since it's possible for Theme author to place the product page under any route, you need to specify its route in the `defaultPages` for Admin panel links to work.  

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

You will learn about plugins in the [next tutorial](/docs/development/plugin-development).  
As theme authors we are interested about plugin's frontend part which is basically a React component. A plain usage will be importing `CPlugin` component and specifying package name. If a plugin supports settings we also can pass them via props:
```tsx
import { CPlugin } from '@cromwell/core-frontend';
/* ... */
<CPlugin id="main_menu"
  pluginName="@cromwell/plugin-main-menu"
  plugin={{
    instanceSettings: {
      mobile: true
    },
}} />
```

Note that some plugins may depend on server-side data fetching. In order to perform it, a plugin should be registered. There are two methods:

1. Via `registerPluginSSR`

Call `registerPluginSSR` in global context (not inside yor component).

```tsx
import { registerPluginSSR } from '@cromwell/core-frontend';

registerPluginSSR('@cromwell/plugin-main-menu', '*');

export default function Header() {
  return (
    <CPlugin id="main_menu"
      plugin={{
        pluginName: "@cromwell/plugin-main-menu",
        instanceSettings: {
          mobile: true
        },
      }} />
  )
}
```

First argument is package name, second is page route ([see `route`](https://cromwellcms.com/docs/development/theme-development#page-config-properties).). Use `*` to register on all pages.


2. In `cromwell.config.js`

For example, on your page you can add only container:
```tsx
import { CContainer } from '@cromwell/core-frontend';

export default function Header() {
  return (
    <CContainer id="menu-container"></CContainer>
  )
}
```

And add Plugin to the `modifications` of a [page config](#page-config-properties):

```json
{
  "type": "plugin",
  "id": "main_menu",
  "parentId": "menu-container",
  "isVirtual": true,
  "plugin": {
    "pluginName": "@cromwell/plugin-main-menu",
    "instanceSettings": {
      "mobile": true
    }
  }
}
```

### Ship Theme with Plugins

You Theme can depend on many plugins, and as in any npm package you can include 
plugins as `dependencies` in `package.json`. That will make install and activate plugins along with your Theme. They also will be available to see in the admin panel.   
But one important thing to note is that when you specify plugins in `dependencies`, user will be unable 
to uninstall plugins in the admin panel and keep your theme. If you want to make them separable then:
1. Move Plugin into `devDependencies` or `peerDependencies` that way it won't be installed automatically 
by package manager in production (when user installs it in the admin panel).
2. In your package.json create property `cromwell.plugins` and list your plugins:
 ```json title="package.json"
{
  /* ... */
  "cromwell": {
    "type": "theme",
    "plugins": ["package-1", "package-2"],
  }
}
```
When user installs your theme from admin panel, after running `yarn add your-theme-name` the CMS will also run `yarn add` for each listed plugin.

## Generic pages

Users can create a new page in the Theme Editor. Since there's no way to add Next.js pages at runtime, this feature is achieved via adding a dynamic page at `pages/[slug]` route. If your Theme doesn't export component at `src/pages/pages/[slug].(jsx|tsx)`, then it will be generated internally at pre-build phase, but you're encouraged to create it yourself since probably you want to have it the same layout as in other pages.  

Theme authors also can create a generic page in the Theme config. Just add a page config with the route: `pages/your-page-name` and put modifications to display some content.  

The difference between generic pages and other pages is that they can have a different page config for a specified slug, while, for example, `/product/[slug]` page will have the same config for every provided slug.

[Use rewrites](/docs/development/redirects/) if you want some generic page appear under your custom route (not under `/pages/`)

### Multiple generic layouts

Theme can define multiple layouts (Next.js pages) to use for generic pages. With that user will be able to pick needed layout in the admin panel.

For example, you created two layouts: `pages-old/[slug]` and `pages-new/[slug]`. Now you need to define your generic pages in the config under `genericPages` property:

 ```js title="cromwell.config.js"
module.exports = {
  /* ... */
  genericPages: [
    {
      route: "pages-old/[slug]",
      name: "default"
    },
    {
      route: "pages-new/[slug]",
      name: "pages new"
    }
  ],
}
```
Note that it will override default route for generic pages at `pages/[slug]`.
 

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
For a Theme `./build` directory should contain `.next`.  
For a Plugin `./build` directory should reflect `src` 3 main directories. 
Your Theme/Plugin also should work locally at http://localhost:4016/

Publish your package to the npm registry:
```bash
npm publish --access public
```

### Publish in the Cromwell CMS market

For your Theme/Plugin to appear in the Admin panel market at `/admin/theme-market` page, we need to add it in our central database. For now there's no automatic process and all new Modules are checked manually (to ensure build correctness and acceptable code quality). You can reach us for publication at `cromwellcms@gmail.com`.  
The publication is free.

## Install

You can install your Theme/Plugin from the CMS market in the GUI of Admin panel or from npm registry in the terminal.

### Install from npm registry

Install in existing/running project, or create a new basic project:
```bash
npx @cromwell/cli create my-website
```

Install your Theme:
```bash
yarn add my-theme-name --exact
```

You don't have to restart CMS, your Theme will be found and displayed in the Admin panel. Now you can set it as active to see at the frontend.  