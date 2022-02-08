---
title: Toolkits intro
sidebar_position: 1
---

# Toolkits intro

Cromwell CMS toolkits are packages that help you build specific kinds of websites.  
Usually they provide frontend components that deal with CMS API and data structures,
apply some toolkit-specific logic, such as managing user cart or checkout process.   
That helps to abstract away Cromwell CMS specifics and allow developers to focus more  
on their apps and UI/UX design.   

Toolkit components are highly customizable via props and can work with different UI frameworks.  
And also to simplify usage toolkits also can provide [HOCs](https://reactjs.org/docs/higher-order-components.html) for specific frameworks or libraries.  
On pages of toolkits you will find a list of base components and a list of additional HOCs that style these
base components, but have the same props API.  
For example, `commerce` toolkit has Material UI versions of all basic components:   
```ts
// Use base `Breadcrumbs` component 
import { Breadcrumbs } from '@cromwell/toolkit-commerce';
// Use `Breadcrumbs` HOC with Material UI elements.
import { MuiBreadcrumbs } from '@cromwell/toolkit-commerce';
```

## Customization

All components follow the same rules for customization via props. There are 3 common props
(though not all components have all 3):

### 1. `classes`
Object with custom CSS classes to assign on inner elements of a component:   
`{ [target_class]: 'your_class' }`  
You can use any styling solution to create your CSS classes:
```tsx
<MuiBreadcrumbs classes={{ link: 'breadcrumbLink' }} />
```
When you browse DOM tree in developer tools you will find already assigned class names that follow the pattern:
`{packageName}_{fileNameHash}_{elementName}`. For example, if you want to style element with CSS class `ccom_tktfs_link`, you need to use `link` in `classes` prop. 
You also can simply override `.ccom_tktfs_link` in your global CSS. Hash is created upon `[`name of the file + package name`]`, so it won't change in the future.

### 2. `elements`
`elements` are custom React components that display specific inner elements. Elements may have logic or 
may need to be interactive, that's why in some cases we need to use `elements` instead of `classes`. 

For example, when you use base `ProductCard` component, you can see product rating displayed simply 
as number `4`. But if you use MuiProductCard, rating will be displayed as 4 bright star icons and 1 hollow.   
You can override `Rating` element of MUI MuiProductCard, or if you don't want to bundle MUI at all, you can use base ProductCard and pass custom `Rating`.
```tsx
<ProductCard elements={{ 
    Rating: ({ value }) => /** Return your JSX */ 
}} />
```

### 3. `text`
`text` allows you to override any text used inside a component. Use it with your internalization solution
to translate components in other languages.  
For example, `Checkout` component displays checkout headers in English such as: "Shipping address". 
Override headers in `text` prop: 
```tsx
<Checkout text={{
    shippingAddress: 'Adresse de livraison'
}} />
```


## Data fetching

Components that fetch data only on client will work out of the box. But some components require to
setup data fetching, so they could be pre-rendered on the backend.

### `withGetProps`
`withGetProps` is a wrapper for any of your Next.js data fetching methods such as: `getStaticProps`,
`getServerSideProps`.   
`withGetProps` can be available as a property on a component. For example, for `Breadcrumbs`:

```tsx title="product/[slug].tsx"
import { MuiBreadcrumbs } from '@cromwell/toolkit-commerce';
import { TGetStaticProps } from '@cromwell/core';
import React from 'react';

type ProductProps = {
  /* ... */
}

const ProductPage: TCromwellPage<ProductProps> = (props) => { 
  return (
    <div>
      <MuiBreadcrumbs />
      /* ... */
    </div>
  )
}

export default ProductPage;

const getProps: TGetStaticProps<ProductProps> = async (context) => {
  /* fetch product */
}

export const getStaticProps = MuiBreadcrumbs.withGetProps(getProps);
```

As you see we only needed to wrap `getProps`, no other action needed. `MuiBreadcrumbs` will get its data
from context on the frontend.

### `getData`

`getData` exposes data fetching method. For example, if you don't want to fetch data server-side via `withGetProps`, you can use `getData` and pass data as a prop.

```tsx title="product/[slug].tsx"
import { MuiBreadcrumbs } from '@cromwell/toolkit-commerce';
import { TGetStaticProps } from '@cromwell/core';
import React, { useEffect } from 'react';

const ProductPage: TCromwellPage = () => {
  const [breadcrumbsData, setBreadcrumbsData] = useState();

  useEffect(() => {
    MuiBreadcrumbs.getData({ productId: 1 }).then(data => 
      setBreadcrumbsData(data));
  }, []);

  return (
    <div>
      <MuiBreadcrumbs data={breadcrumbsData} />
      /* ... */
    </div>
  )
}

export default ProductPage;
```

### `useData`

If data was fetched via `withGetProps` you can access it via `useData` hook:

```tsx title="category/[slug].tsx"
import { MuiCategoryList } from '@cromwell/toolkit-commerce';
import { TGetStaticProps } from '@cromwell/core';
import React from 'react';

const CategoryPage: TCromwellPage = () => { 
  const categoryData = MuiCategoryList.useData();

  return (
    <div>
      <h1>{categoryData?.category?.name ?? ''}</h1>
      <MuiCategoryList />
    </div>
  )
}

export default CategoryPage;

export const getStaticProps = MuiCategoryList.withGetProps();
```