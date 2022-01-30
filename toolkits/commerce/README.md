# Toolkit for building e-commerce websites with Cromwell CMS

- Read about Cromwell CMS toolkits in general: [https://cromwellcms.com/docs/toolkits/intro](https://cromwellcms.com/docs/toolkits/intro).
- [Live demo](https://demo-store.cromwellcms.com/category/2)
- See examples of usage in [theme-store](https://github.com/CromwellCMS/Cromwell/tree/master/themes/store).

## Use

```sh
npm i @cromwell/toolkit-commerce
```

```tsx title="category/[slug].tsx"
import { MuiCategoryList } from '@cromwell/toolkit-commerce';
import React from 'react';

export default function CategoryPage() { 
  return (
      <MuiCategoryList />
  )
}

export const getStaticProps = MuiCategoryList.withGetProps();
```

## List of components

- [Breadcrumbs](https://cromwellcms.com/docs/toolkits/commerce#breadcrumbs)
- [CartList](https://cromwellcms.com/docs/toolkits/commerce#cartlist)
- [CategoryFilter](https://cromwellcms.com/docs/toolkits/commerce#categoryfilter)
- [CategoryList](https://cromwellcms.com/docs/toolkits/commerce#categorylist)
- [CategorySort](https://cromwellcms.com/docs/toolkits/commerce#categorysort)
- [Checkout](https://cromwellcms.com/docs/toolkits/commerce#checkout)
- [CurrencySwitch](https://cromwellcms.com/docs/toolkits/commerce#currencyswitch)
- [ProductActions](https://cromwellcms.com/docs/toolkits/commerce#productactions)
- [ProductAttributes](https://cromwellcms.com/docs/toolkits/commerce#productattributes)
- [ProductCard](https://cromwellcms.com/docs/toolkits/commerce#productcard)
- [ProductGallery](https://cromwellcms.com/docs/toolkits/commerce#productgallery)
- [ProductReviews](https://cromwellcms.com/docs/toolkits/commerce#productreviews)
- [ProductSearch](https://cromwellcms.com/docs/toolkits/commerce#productsearch)
- [ViewedItems](https://cromwellcms.com/docs/toolkits/commerce#vieweditems)
- [Wishlist](https://cromwellcms.com/docs/toolkits/commerce#wishlist)