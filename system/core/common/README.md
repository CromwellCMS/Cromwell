CromwellCMS Shared SDK

Exports common type definitions and helpers used by frontend and backend.

### Install

```
npm i @cromwell/core
```

### Use

Example of usage

```ts
import { getStoreItem, TCmsSettings } from '@cromwell/core';

const settings: TCmsSettings | undefined = getStoreItem('cmsSettings');
```
