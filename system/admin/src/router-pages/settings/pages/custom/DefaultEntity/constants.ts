import { EDBEntity } from '@cromwell/core';

export const entities = [
  {
    entityType: EDBEntity.Product,
    entityLabel: 'Product',
    listLabel: 'Products',
  },
  {
    entityType: EDBEntity.ProductCategory,
    entityLabel: 'Category',
    listLabel: 'Categories',
  },
  {
    entityType: EDBEntity.Post,
    entityLabel: 'Post',
    listLabel: 'Posts',
  },
  {
    entityType: EDBEntity.Tag,
    entityLabel: 'Tag',
    listLabel: 'Tags',
  },
  {
    entityType: EDBEntity.User,
    entityLabel: 'User',
    listLabel: 'Users',
  },
  {
    entityType: EDBEntity.CMS,
    entityLabel: 'General',
    listLabel: 'General',
  },
];
