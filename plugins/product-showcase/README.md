# Product showcase plugin for Cromwell CMS

Adds a carousel with products. On a product page it will fetch products from same categories, on other pages - most recent products.  

Relies on shared product card component. To register, for example add this code in custom app:  
```ts title="_app.tsx"
import { registerSharedComponent } from '@cromwell/core';
import { MuiProductCard } from '@cromwell/toolkit-commerce';

registerSharedComponent(ESharedComponentNames.ProductCard, MuiProductCard);

export default function App() { /* ... */ }
```