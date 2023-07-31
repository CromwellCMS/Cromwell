---
title: Introduce Cromwell CMS
slug: intro-cromwell-cms
tags: [Introduction, Cromwell, CMS]
image: /img/blog/1_YD27_slzjBjcCuyifHciMQ.jpeg
---

## Motivation

Jamstack is out for a while. For most of us (developers) statically pre-rendered React websites are no wonder: page routing in the browser, “blazing-fast” (as they usually call it) experience, etc. Try Gatsby or Next.js and you’ll have it. If you are a web developer, you know React and probably know to do something with it. But for many normal people, it still looks like some expensive product they can live without.

78.9% of the internet is still on PHP. Well, a lot of these websites are old and these days developers choose PHP not that often. But for WordPress (39.6%) the number is always growing. Type in Google “E-commerce CMS” and you will get good old-timers with some advices on removing reliance on developers.
Meanwhile many modern Node.js CMS go the other way, the headless. If you want a frontend, be ready to hire a developer. Oh, it will cost you.
Or if your Node.js CMS is not just headless then where do I click to install a plugin? Well, many of them don’t support such plugins.

But a lot of non-programming people want an independent platform that they can simply manage and customize by themselves. That’s one of the major reasons that makes WordPress still so popular. Otherwise, everyone will just hire a developer to make a super fast and cool website.  
Despite the advantage of Node.js, full-stack Javascript / Typescript, SPA and so on, people still stay on LAMP stack. And not because it’s the best, we can blame it for many problems. In one article I read author was comparing Wordpress and Ghost CMS. He was blaming Wordpress of being slow and insecure because of its plugins, and since Ghost CMS doesn’t have plugins it’s better by both points. But I don’t think an absence of potentially useful feature can be considered as an advantage.

If only existence of a plugin feature is a problem, then the problem is in the core design of CMS, not in a plugin. On the other hand, if CMS doesn’t support extensions, then again, something is wrong with core design of CMS, because this CMS won’t be future-proof in my opinion.

There has to be a solution that can encompass all modern bleeding-edge techs. Statically pre-rendered React for frontend, mature and maintainable backend (look at Nest.js and TypeORM for example). GraphQL API that shines in CMS development where end users can build any type of frontend.  
But I couldn’t find the same level of versatileness, extendability, power in building plugins along with powerful GUI everyone can handle that WordPress provides. That’s how I ended up working on a side project most of my free time for past two years.

Today I decided to go public with the project, so I’m introducing it: Cromwell CMS. You can find some example websites at: https://cromwellcms.com/docs/overview/intro#examples
CMS is free and open-source, you can check the code or give at a star https://github.com/CromwellCMS/Cromwell

## Core design

Node.js environment pretty much conveniently came up to a package system. Everything is a package. One like another can be installed via simple npm command and downloaded into flat node_modules structure.
Following the tradition, Cromwell CMS is a set of packages and services that can be installed and launched independently. It inherits the advantages of microservice architecture, and it’s much easier to update the CMS simply via running one npm or yarn command.

I can also call it headless CMS because it’s possible to run API server with any custom frontend.
So there are 4 main services:

1. API server service. API server is written with Nest.js and TypeGraphQL, REST API for transactions, GraphQL for data flow. Both types of API are extendable by plugins (about it below).
2. Frontend service (Next.js). Basically, it is a custom Next.js server.
3. Admin panel service. Serves files of admin panel.
4. Managing service. This service is launching, watching, and restarting other services on user GUI input. For example, it’s easier to change a theme in WordPress, but with Next.js we have to restart the server with another app build. Well, it’s not common to restart servers as part of production lifecycle, but in my tests it is quite stable, I believe that can work with proper handling.

## Theming engine

All themes are npm packages. Just install a package with specific property in package.json and CMS will recognize it and display a theme in the admin panel. Then a user can pick a theme and CMS will take ready app build from theme package in node_modules, place it in working frontend directory and restart Next.js server.

While installing via npm is convenient for developers, it doesn’t sound user-friendly. So I decided to go even further and implemented GUI for package managing in the admin panel. When user goes into the theme or plugin market (in the admin panel GUI, same as “Add new plugin” in WordPress) and clicks “install”, CMS internally runs yarn command to add a package. Similar happens on remove/uninstall.  
Then every theme can be highly customizable in admin panel drag-and-drop theme editor (sort of a website builder). User can move blocks, change text, images, add plugins, etc. React gives us the power to provide such systems out of the box.

<img src="/img/blog/1_k-hpw7dtmj590vMZzk4Mag.jpeg"/>

I’m trying to combine best of the both worlds: properly programmed frontend in React and power in GUI of a normal website builder. Well, Cromwell CMS builder is not yet powerful as well-known solutions, but my goal is to make it so. Important thing is that it follows code-first approach which is the right way in my opinion to build websites. No crippled layouts made from scratch in a glitchy website builder (it actually possible in Cromwell CMS as well, but you won’t do that).
Anyway, almost everyone when starts with any CMS just picks a ready theme.

As for developing themes, you can make any Next.js app, just build it with Cromwell CLI that customizes Next.js build process to make your app CMS-compatible. There are also some recommendations like following Next.js static optimization practices, so at run-time Next.js will use [incremental static regeneration](https://vercel.com/docs/concepts/next.js/incremental-static-regeneration) making your website work blazingly fast as any other JAM stack website. Technically pre-rendered pages at build time will be re-generated after user installs a theme, but it’s close to JAM stack workflow and it’s available to everyone.

## Plugins

Plugins are packages that can export extensions or subscribe to actions (same as hooks in Wordpress). Plugins give you the power to build your app with the best (or at least ones of the best) frameworks there are.  
You can export custom Nest.js controller, TypeGraphQL resolvers, TypeORM entities, and more. Since both REST and GraphQL API are extendable as a plugin author you have a choice to pick what’s best for your app.
At the frontend you can register widgets for the admin panel or theme frontend (user will have to place your plugin in theme editor).

See [our guide for more info](https://cromwellcms.com/docs/development/plugin-development/).
Plugins can be installed in the admin panel and all extensions will be applied automatically without any manual CLI command.

## What your customers get

- Superfast frontend experience due to the power of React and Next.js statically pre-renders pages.
- Online store and blogging platform. Apart from providing bleeding-edge techs, it must have a decent admin panel experience, not worse than well-known CMS. Modern block-styled text editor based on [Editor.js](https://editorjs.io/)
  <img src="/img/blog/1_SKGW9asz4hnAmeWu566mmQ.jpeg"/>
- Free full-featured online store and blog theme. Free plugins. That and I will be adding more. A user can turn from any other CMS simply and for free start trying or using Cromwell CMS. As for me, it’s a side-project that I really enjoy putting free time into and it won’t change. Everything added for free will stay free forever.
  <img src="/img/blog/1_eS1P60l8HGt2TwkNUy1PEw.png"/>
- Easy to install and use themes and plugins. Everything is right in the admin panel GUI. Website builder.
- As concludes from previous points — the tempting ability to exist without web developers.
- SEO friendly. Every page has statically pre-rendered HTML. CMS allows to edit SEO meta-tags, provides automatically generated sitemap and robots.txt.
- Migration. Export your data from other CMS into Excel file and import it.
- Emailing, payments and other integrations.

In conclusion
WordPress is often chosen because of its plugins and themes abundance. I cannot replicate it. But I can try to create an environment, what next is up to community. Together we can create a great ecosystem. And more people are using it, more will. Things like that can change the web.
I’m not saying that my system is better than WordPress (since I haven’t spent a dozen years on it yet), but I’m trying to solve problems and provide a solution that can be better in a number of ways.
For now, I’m asking for feedback on how to improve it. And the project is open-source, anyone can try it. In the end, it all depends on the community. How soon we’ll embrace a new most popular language at backend development? Will there be a day when Node.js is powering 78.9% of the internet? ;)

Originally published in https://itnext.io/remaking-wordpress-in-js-stack-hello-to-a-new-cms-for-next-js-websites-63096bc5f98b
https://app.daily.dev/posts/zyThWPCEq
