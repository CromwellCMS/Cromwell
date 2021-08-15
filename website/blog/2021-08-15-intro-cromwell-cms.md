---
slug: intro-cromwell-cms
tags: [Introduction, Cromwell, CMS]
---

# Intro: Cromwell CMS

:::note
TL;DR. The post introduces a new full-stack JS/TS CMS for fast Next.js websites. Here some production-ready examples:
:::

JAM stack is out for a while. For most of us (developers) statically optimized websites are no wonder: page routing in the browser, "blazing-fast" (as they usually call it) experience, etc. Try Gatsby or Next.js and you'll have it. If you are a web developer and know React to do something with it. But for many normal people it still looks like some expensive product they can carefree live without.

78.9% of the internet is still on PHP. Well, a lot of these websites are old and not really maintained. But for WordPress (39.6%) the number is always growing. People gladly choose it. Type in Google "E-commerce CMS" and you will get good old-timers with some advices on removing reliance on developers. 

Meanwhile many modern Node.js CMS go the other way, the headless. If you want a frontend, be ready to hire a developer. Oh, it will cost you.  
Or if your Node.js CMS is not just headless then where do I click to install plugin? (spoiler: usually they don't support such plugins). But as a customer I want something like Yoast plugin to do magic on my new website!

Despite the advantage of Node.js, full-stack Javascript / Typescript, SPA and so on.. I'd say LAMP stack is doing pretty fine.   
So I had a thought: I should help to fix it.  
We need a CMS that people will gladly choose over WordPress. And how much joy it will bring for freelance developers to stop fixing old PHP plugins and get more offers to work with a new stack?
After switching from working with PHP CMS as a freelance developer to full-stack TypeScript job and feeling all the difference "on my own skin", I decided to make a CMS myself. That's how I ended up working on a side project most of my free time for past two years (not only because Covid made people crazy, but rather because I really enjoy programming)

As from my point of view, the result shouldn't be just developer-first or user-first CMS. In many places I tried to combine best of both worlds. And on the other hand the project should be realistic. Considering my goals and available resources here are main points of the CMS that I managed to implement at the moment:

From a user point of view:
- Blazing-fast frontend experience due to the power of React and Next.js.
- Online store and blogging platform. Apart from providing bleeding-edge techs, it must have a decent admin panel experience, not worse than in most CMS. 
- Modifiable theme layout in drag-and-drop website builder. It's not yet as powerful as well-known services, but my goal is to make it so.
- Unlike many other website builders you own your website and everything you do with it (just to note, everything you build in Wix editor is not really your property)
- Easy to install and use themes and plugins.
- As concludes from previous points - the ability to basically exist without web developers. Easy installation and maintenance.
- Hence it is cheap. Including the fact that CMS and default themes and plugins are free and under MIT license.
- SEO friendly. Every page is statically pre-rendered by Next.js and has important meta-tags. Built-in CMS sitemap and rebots.txt.
- Migration. Export your data from other CMS into Excel file and import it.
- Emailing and payments integrations.
- Free full-featured online-store and blog theme. Free plugins. That and I will be adding much more. That's one of key points. A user can turn from any other CMS simply and for free start trying or using Cromwell CMS. A customer shouldn't pay money to be convinced that a product is a good way to go. As for me, it's a side-project that I really enjoy putting free time into and it won't change. Everything added for free will stay free forever.


From a developer point of view:
- Users can exist without developers? Ha-ha! They always want more, so we'll make more themes and plugins that we can sell.
- Freedom and ease in building themes. In Cromwell CMS a theme is just a Next.js app (you can use our componets if you want to make some parts modifyable in website builder). Our compiler will do the rest to make your app work with the CMS.
- Principles of headless CMS. Cromwell CMS is a set of services that can run independently: API Server, Theme frontend (Next.js) and Admin panel frontend. 
- Headless CMS are quite popular these days and for many reasons. If you don't like how we manage themes, you can build any kind of custom frontend and host it whenever you like. Just use our API server and disable Next.js one.
- GraphQL data API for building any type of theme or even mobile app that gets only data it needs. That and plus REST API for some CMS transactions. Both types of API are extendable by plugins. As a plugin author, you have a choice to pick what's best for your app.
- Designed to be scalable. Since the CMS is a set of services, you can host each service independently. If you need more power on the frontend you can even host many services on different VDS, and when an admin presses a "change theme" button in the admin panel, all the services will change their active theme. You will only need to setup a load-balancing Nginx config.
- Power in building plugins with the best (or at least ones of the best) frameworks there are. Write your custom TypeORM entities, Nest.js controllers or TypeGraphQL resolvers. Frontend works as a Next.js page. Basically you can do anything with it.
- Our compiler allows you to re-use node_modules between themes and plugins to make frontend bundles as small as possible. Our default themes laready use Material-UI, so using it in a plugin won't add any costs.



WordPress is often chosen because of its plugins and themes abundance. I cannot replicate it. But I can try to create an environment, what next is up to community. Together we can create great   and more people are using it, more will. Things like that can change the web.  

I'm not having illusions that my system is already better than WordPress (since I haven't spent dozen years on it yet), but I'm trying my best. For now, I'm here to ask feedback on how to improve it. Well, and the project is open-source, anyone can try it. In the end, it all depends on community. How soon we'll embrace a new dominant language at backend development? Will there be a day when Node.js is powering 78.9% of the internet?
