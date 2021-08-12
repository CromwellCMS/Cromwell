---
sidebar_position: 3
---

# SEO

Modern development tends to prefer single page applications. Not only because it's more convenient for developers, it reduces server costs and provides blazing fast browsing experience. But Despite the fact how fats browser-side page switching, it doesn't have much value if we want to do get into search systems. 
Next.js solves that problem with its [hybrid applications](https://nextjs.org/docs/advanced-features/automatic-static-optimization) and [Incremental Static Regeneration](https://vercel.com/docs/next.js/incremental-static-regeneration).
That's how in Cromwell CMS we can serve static HTML file for every page even with its Plugins allowing SEO to work as in any other Wordpress-like CMS. 

## Meta tags

We have support for major meta-tags (although it may depend on Theme implementation):
- `<title>` 
- `<meta property="og:title" />`
- `<meta property="description" />`
- `<meta property="og:description" />`
- `<meta property="og:url" />`
- `<meta property="og:image" />`

Title and description for single pages can be modified in Theme editor. There also you can add your custom HTML with additional meta tags.
For dynamic pages like: `product/[name]` you can edit content of tags along with other data. For example, `/admin/#/product/1` page has `Meta title` and `Meta description` fields.  
`og:image` is usually taken from main picture of a post, or first image of a product.

## Sitemap and robots.tsx

Both files are generated automatically after CMS installation.  
You can edit content of robots.tsx in Admin panel > Settings > SEO. It should have link to generated sitemap by default. But you can add your Sitemap and change the link.

Default Sitemap is generated and update once in a day. It uses Theme's pages with info from DB, so all available products, post, etc should be included in it. If you added new data and you want to update the Sitemap immediately, there's `Rebuild Sitemap` button in Settings.
