---
sidebar_position: 3
---

# SEO

## Note for developers

Modern development tends to prefer single page applications. Not only because it's more convenient for developers, it reduces server costs and provides blazing-fast browsing experience. But despite the fact how fast browser-side page routing is, it doesn't have much value if we want to do get into search systems. 
Next.js solves that problem with its [hybrid applications](https://nextjs.org/docs/advanced-features/automatic-static-optimization) and [Incremental Static Regeneration](https://vercel.com/docs/next.js/incremental-static-regeneration).
That's how in Cromwell CMS we can serve static HTML files for every page even with its Plugins allowing SEO to work as in any other Wordpress-like CMS. 


## Meta tags

We have support for major meta-tags (although it may depend on Theme implementation):
- `<title>` 
- `<meta property="og:title" />`
- `<meta name="description" />`
- `<meta property="og:description" />`
- `<meta name="keywords" />`
- `<meta property="og:url" />`
- `<meta property="og:image" />`

Title and description for single pages can be modified in Theme editor. There also you can add your custom HTML with additional meta tags for a page.
For dynamic pages like: `product/[name]` you can edit content of tags along with other data. For example, `/admin/product/1` page has `Meta title` and `Meta description` fields.  
`og:image` is usually taken from the main picture of a post, or first image of a product.


## Sitemap and robots.txt

Both files are generated automatically after CMS installation.  
You can edit content of robots.txt in Admin panel > Settings > SEO. It should have a link to generated sitemap by default. But you can upload your custom Sitemap in the File manager (Media) and change the link.

Default Sitemap is generated and updated once a day. It uses Theme's pages with info from DB, so all available products, posts, etc should be included in it. 
:::note
After you create a new product/post, it won't be displayed in the sitemap immediately. If you want newly added data to appear in it right away, there's `Rebuild Sitemap` button in SEO Settings.
:::