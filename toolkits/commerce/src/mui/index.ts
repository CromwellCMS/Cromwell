import { Alert, Breadcrumbs as MuiBreadcrumbs, Button, Chip, Rating, TextField, Tooltip } from '@mui/material';

import { AdapterType, withAdapter } from '../adapter';
import { Breadcrumbs as BaseBreadcrumbs } from '../base/Breadcrumbs/Breadcrumbs';
import { ProductAttributes as BaseProductAttributes } from '../base/ProductAttributes/ProductAttributes';
import { ProductReviews as BaseProductReviews } from '../base/ProductReviews/ProductReviews';
import { Pagination } from './Pagination/Pagination';
import { AttributeValue } from './ProductAttributes/AttributeValue';
import { AttributeTitle } from './ProductAttributes/AttributeTitle';

const muiAdapter: AdapterType = () => {
  return {
    Pagination,
    Alert,
    Button,
    Rating,
    TextField,
    Tooltip: Tooltip as any,
    Breadcrumbs: MuiBreadcrumbs,
    Chip: Chip as any,
    AttributeValue,
    AttributeTitle,
  }
}

export const ProductReviews = withAdapter(BaseProductReviews, muiAdapter);
export const ProductAttributes = withAdapter(BaseProductAttributes, muiAdapter);
export const Breadcrumbs = withAdapter(BaseBreadcrumbs, muiAdapter);