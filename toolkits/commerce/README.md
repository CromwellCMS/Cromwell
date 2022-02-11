# Commerce toolkit
 
> A toolkit for building e-commerce websites with Cromwell CMS

### Links

- Read about Cromwell CMS toolkits in general: [https://cromwellcms.com/docs/toolkits/intro](https://cromwellcms.com/docs/toolkits/intro).
- [Live demo](https://demo-store.cromwellcms.com/category/2)
- See examples of usage in [theme-store](https://github.com/CromwellCMS/Cromwell/tree/master/themes/store).

### Install

```sh
npm i @cromwell/toolkit-commerce
```

Some components of this package use `react-toastify`. If you need notifications add `ToastContainer` into your custom app:
```tsx title="_app.tsx"
import React from 'react';
import { ToastContainer } from 'react-toastify';

export default function App() {
  return (
    <div>
      /* ... */
      <ToastContainer />
    </div>
  );
}
```

Add global CSS in `cromwell.config.js`:
```js title="cromwell.config.js"
module.exports = {
  globalCss: [
    '@cromwell/toolkit-commerce/dist/_index.css',
    'react-toastify/dist/ReactToastify.css'
  ],
}
```

### Use

Example of usage of a component for product category:  

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

### List of components

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

### HOCs

- [Material UI](https://mui.com/)

### Material UI HOCs

- [MuiBreadcrumbs](https://cromwellcms.com/docs/toolkits/commerce#muibreadcrumbs)
- [MuiCartList](https://cromwellcms.com/docs/toolkits/commerce#muicartlist)
- [MuiCategoryList](https://cromwellcms.com/docs/toolkits/commerce#muicategorylist)
- [MuiCategorySort](https://cromwellcms.com/docs/toolkits/commerce#muicategorysort)
- [MuiCheckout](https://cromwellcms.com/docs/toolkits/commerce#muicheckout)
- [MuiCurrencySwitch](https://cromwellcms.com/docs/toolkits/commerce#muicurrencyswitch)
- [MuiProductActions](https://cromwellcms.com/docs/toolkits/commerce#muiproductactions)
- [MuiProductAttributes](https://cromwellcms.com/docs/toolkits/commerce#muiproductattributes)
- [MuiProductCard](https://cromwellcms.com/docs/toolkits/commerce#muiproductcard)
- [MuiProductReviews](https://cromwellcms.com/docs/toolkits/commerce#muiproductreviews)
- [MuiProductSearch](https://cromwellcms.com/docs/toolkits/commerce#muiproductsearch)
- [MuiViewedItems](https://cromwellcms.com/docs/toolkits/commerce#muivieweditems)
- [MuiWishlist](https://cromwellcms.com/docs/toolkits/commerce#muiwishlist)