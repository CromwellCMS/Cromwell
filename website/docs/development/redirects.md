---
sidebar_position: 5
---

# Redirects / rewrites

Redirects/rewrites are often used in content maintenance of a website or for SEO purposes. If you worked with Wordpress you may know this feature from Yoast plugin or from configurations in .htaccess file. In Cromwell CMS there's no .htaccess file, in production usage we rely on Nginx web server, so these settings can be configured in `nginx.conf` which we already mentioned in [installation guide](../overview/installation).  
But it also much useful to have such configuration available in the CMS, for example, if you want to make your own plugin similar to Yoast.

Redirects/rewrites may be tricky to implement in React/Next.js applications. After first page load navigation handled by `'next/link'` and `'next/router'` packages in the browser. New URLs are pushed to the browser's history and pages then re-rendered. All this happens without involvement of Next.js server which means redirects/rewrites should be handled not only by the server (on first page request), but also by application in the browser.   
Next.js natively supports redirects/rewrites, but with one limitation: they should be specified in `next.config.js` file and they are only applied on application build. Theme authors can possibly use that (though it's not recommended in Cromwell CMS), but there's no way to change redirects/rewrites dynamically (in Admin panel for example). Well, there's another limited option to use redirects in server's `getStaticProps`, but with no support for rewrites.  

With all that considered we implemented our own redirection mechanism in Cromwell CMS. Internally it works using Next.js custom server plus some patches on `'next/router'` package. Externally it provides a simple API to use this mechanism.  

Redirects and rewrites can be as statically configured in CMS config/settings, or can be changed dynamically by Themes and Plugins.

## In cmsconfig.json

You can add redirects or rewrites in `cmsconfig.json` file: 
```json title="cmsconfig.json"
{
  "redirects": [
    {
      "from": "/category/1",
      "to": "/category/2",
      "permanent": true
    }
  ],
  "rewrites": [
    {
      "from": "/post/1",
      "to": "/about-us"
    }
  ]
}
```

#### Redirect's logic
After accessing (opening) "/category/1" page, user will be redirected to "/category/2" page. Search engines will receive 301 http code if `"permanent": true` or 307 if `"permanent": false`, or you can provide your status code (to use 308 for example), [see TCmsRedirectObject in declarations](../api/modules/common.md#tcmsredirectobject). User's browser history will be replaced.  

#### Rewrite's logic
When user visits "/about-us", even if there's no page defined by an active Theme, user will see "/post/1" page. Be careful with rewrites, they can make the same content to be available under two different routes (which is bad for SEO). In example above the content of "/post/1" page will be served under two routes. So additionally you may want to hide original page by adding another rewrite to 404 page:  
```json
{
  "from": "/404",
  "to": "/post/1"
}
```

## In CMS settings

Authors of Plugins can save redirects/rewrites into the database as CMS settings:
```ts
import { getRestAPIClient } from '@cromwell/core-frontend';

(async () => {
  const settings = await getRestAPIClient().getAdminCmsSettings();
  if (!settings.redirects) settings.redirects = [];
  settings.redirects.push({
    from: '/category/1',
    to: '/category/2',
    permanent: true,
  });
  await getRestAPIClient().saveCmsSettings(settings);
})();
```

## Dynamically in Plugins

Another and the most powerful option is to register dynamic redirect/rewrite. You can add it in the [frontend bundle of your Plugin](./plugin-development#frontend):
```ts
import { registerRedirect, registerRewrite } from '@cromwell/core';

registerRedirect('my-plugin-name-redirect', (pathname, search) => {
  // 307 redirect for only one page
  if (pathname === '/post/1') return {
    to: '/post/2',
    permanent: false,
  }
  // 301 redirects for any routes under /category-old/* to /category-new/*
  if (pathname.startsWith('/category-old')) return {
    to: '/category-new' + pathname.replace('/category-old', ''),
    permanent: true,
  }
});

registerRewrite('my-plugin-name-rewrite', (pathname, search) => {
  // Replace page at '/about-us' by '/post/1'
  if (pathname === '/about-us') return {
    from: '/post/1',
  }
});
```

registerRedirect / registerRewrite accept:
- **ruleName**`:string` - Unique name (id) of your redirect/rewrite rule. Make sure to use your own Plugin name to avoid collisions with other Plugins.
- **redirect**[`:TCmsRedirect`](../api/modules/common.md#tcmsredirect) - Redirect/rewrite object config as in `cmsconfig.json` example, or a function as in example above. The function will be executed against each request at the server and for each route change at the frontend. 