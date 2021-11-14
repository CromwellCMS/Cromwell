---
sidebar_position: 5
---

# Custom data types

In WordPress there are many solutions for storing specific data in your CMS.  
By the core WordPress provides a concept for custom post types. That is very convenient if you want to manage in the CMS other basic types of content: products, movies or whatever. 
And if you want to extend existing posts with some custom fields, you can install a plugin to handle the data.

In Cromwell CMS these concepts are implemented in the core. In design this is a compilation of three well-known features:   
- [Wordpress Post Types](https://wordpress.org/support/article/post-types/)
- [Advanced Custom Fields](https://wordpress.org/plugins/advanced-custom-fields/)
- [Admin Columns](https://wordpress.org/plugins/codepress-admin-columns/)


<iframe width="560" height="315" src="https://www.youtube.com/embed/UbV20L6ZBMc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Custom fields

Let's say you want to add a new field for products called "Brand". In the admin panel go to the `Settings -> Custom data -> Product` and click plus button in the Product section. This will create a custom field.  

A field has several properties:  
- Key. The key will be used in GraphQL queries to retrieve your data. Note that **key must be unique** for one entity. 
- Label will be displayed in the admin panel edit page. 
- Field type. You can choose one of many field types:
    - Simple text. Just a text string.
    - Text editor. Rich text editor that used to write posts.
    - Select. User will be able to pick a defined value
    - Image. Will store URL to an image. It can be one from CMS media or any external source.
    - Gallery. Several images in one field.
    - Color. Uses admin panel Colorpicker to choose a color. 

Type "Brand" in Key and in Label and hit "SAVE" button at the top.
Now go `Store -> Products -> Edit a product` and you will notice a new field called "Brand" at the bottom of the page. 
If you want to see "Brand" column in the product list, go back to the list and hit gear icon at the top right. Click a checkbox against Brand and close the popup by clicking anywhere on the page. Column Brands will appear in the list. Now you can search or sort all products by this new column.


### How this works

Cromwell CMS has meta data tables to store any key-value pairs. Data of custom fields stored in this meta data. After user fills any text into your custom field, CMS will create a record in meta table with entity id, key and value. After that we can search or sort over meta data using SQL joins and TypeORM query builder.    
The concept is similar to WordPres but there's a difference. WordPress has one table for all metadata called wp_postmeta. On huge websites it can vastly bloat which will slow down queries. That's why in Cromwell CMS we have a meta table per default entity. Products will store meta in crw_product_meta, posts in crw_post_meta.    


## Custom entities

Custom entities are similar to custom post types in WordPress.
For example, you want to store movies in your CMS. In the admin panel go to `Settings -> Custom data`, scroll to the bottom and click "Add entity" button. This will open popup with several properties:
- Type. Custom entity type/name. Will be used in GraphQL queries. Must be unique. (Eg. Movie)
- List label. How to call many entities, will be used in the admin sidebar as a link title. (Eg. Movies)
- Entity label. How to call one entity. (Eg. Movie)
- Icon. Icon to display for the admin sidebar link.

Click apply, it will create a new entity type. After that you can add custom fields to this entity. Click save and Movies link should appear in the sidebar under Blog link.  

Same as with meta we don't want to bloat default tables, so custom entities are stored in their own table called `crw_custom_entity`


## GraphQL

You can query fields you need at the frontend with GraphQL. But there is a small inconvenience that we cannot dynamically change GraphQL types to include custom fields, so all fields are requested in GraphQL argument:

```graphql
query GetPostById {
  getPostById(id: 15) {
    title
    customMeta(keys: ["key1", "key2"])
  }
}
```

If the post has any meta data corresponding to provided keys it will return the following object:
```json
{
  "data": {
    "getPostById": {
      "title": "My post",
      "customMeta": {
          "key1": "key 1 value",
          "key2": "key 2 value"
      }
    }
  }
}
```
`customMeta` will have null value if all requested keys aren't set.  

Custom entities should be requested via filter method:

```graphql
query GetFilteredCustomEntities {
  getFilteredCustomEntities(
    filterParams: {
      entityType: "Brand"
    }, 
    pagedParams: {
      pageNumber: 1,
      pageSize: 15
    }) {
    elements {
      id
      slug
      entityType
      customMeta(keys: ["key1", "key2"])
    }
    pagedMeta {
      pageNumber
      pageSize
      totalElements
      totalPages
    }
  }
}
```

### Sorting & filtering

Cromwell CMS has a base filter that allows to sort or filter over any meta key or entity default column.
For example, you want to get only entities with `key1` that contains `text1` in value (SQL LIKE operator) and sort by `key2`:

```graphql
query GetFilteredCustomEntities {
  getFilteredCustomEntities(
    filterParams: {
      entityType: "Brand",
      filters: [
        {
          key: "key1",
          value: "text1",
          inMeta: true
        }
      ]
      sorts: [
        {
          key: "key2",
          inMeta: true
        }
      ]
    }, 
    pagedParams: {
      pageNumber: 1,
      pageSize: 15
    }) {
    elements {
      id
      slug
      entityType
      customMeta(keys: ["key1", "key2"])
    }
  }
}
```

Note that we have `inMeta: true` to indicate that we want to work with data in meta. If `inMeta: false` or not specified, then CMS will consider `key` as a column name in entity table. For example, if you want to filter by post title, then provide `key: "title"`.