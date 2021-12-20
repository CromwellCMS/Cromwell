import { ProductReviews as BaseProductReviews } from '../base/ProductReviews/ProductReviews';
import { Pagination } from './Pagination/Pagination'
import { withAdapter, AdapterType } from '../adapter';
import { Alert, Button, Rating, TextField, Tooltip } from '@mui/material';

const muiAdapter: AdapterType = () => {
  return {
    Pagination,
    Alert,
    Button,
    Rating,
    TextField,
    Tooltip: Tooltip as any,
  }
}

export const ProductReviews = withAdapter(BaseProductReviews, muiAdapter);