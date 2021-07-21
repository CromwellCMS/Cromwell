CromwellCMS Backend SDK

Exports backend helpers, ORM repositories and entities.

### Install
```
npm i @cromwell/core-backend
```

### Use

Example of usage
```ts
import { ProductRepository } from '@cromwell/core-backend';
import { getCustomRepository } from 'typeorm';

const products = await getCustomRepository(ProductRepository).getProducts();
```
