import { Alert, Breadcrumbs as MuiLibBreadcrumbs, Button, IconButton, Rating, TextField, Tooltip } from '@mui/material';
import React from 'react';
import { toast as toastify } from 'react-toastify';

import { BreadcrumbElements, Breadcrumbs as BaseBreadcrumbs } from '../base/Breadcrumbs/Breadcrumbs';
import { ProductActions as BaseProductActions, ProductActionsProps } from '../base/ProductActions/ProductActions';
import {
  ProductAttributes as BaseProductAttributes,
  ProductAttributesProps,
} from '../base/ProductAttributes/ProductAttributes';
import { ProductCard as BaseProductCard, ProductCardProps } from '../base/ProductCard/ProductCard';
import { ProductReviews as BaseProductReviews, ProductReviewsProps } from '../base/ProductReviews/ProductReviews';
import { withElements } from '../helpers/withElements';
import { StyledBreadcrumb } from './Breadcrumbs/Breadcrumbs';
import { NotifierWrapper } from './Notifier/Notifier';
import notifierStyles from './Notifier/Notifier.module.scss';
import { Pagination } from './Pagination/Pagination';
import { ActionButton } from './ProductActions/ProductActions';
import { AttributeTitle } from './ProductAttributes/AttributeTitle';
import { AttributeValue } from './ProductAttributes/AttributeValue';
import { QuantityField } from './QuantityField/QuantityField';

export const MuiBreadcrumbs = withElements(BaseBreadcrumbs, {
  Wrapper: MuiLibBreadcrumbs,
  Breadcrumb: (props) => React.createElement(StyledBreadcrumb, { onClick: () => '', component: "div", ...props, } as any),
} as BreadcrumbElements)

export const MuiProductAttributes = withElements(BaseProductAttributes, {
  AttributeValue,
  AttributeTitle,
} as ProductAttributesProps['elements']);

export const MuiProductReviews = withElements(BaseProductReviews, {
  Alert,
  Button,
  Rating,
  TextField,
  Pagination,
  Tooltip: Tooltip as any,
} as ProductReviewsProps['elements']);

export const MuiProductActions = withElements(BaseProductActions, {
  Button: ActionButton,
  Alert,
  QuantityField,
} as ProductActionsProps['elements'], {
  notifierOptions: {
    position: toastify.POSITION.TOP_RIGHT,
    className: notifierStyles.muiToast,
    Wrapper: NotifierWrapper,
  }
} as ProductActionsProps);

export const MuiProductCard = withElements(BaseProductCard, {
  Button: IconButton,
  AddCartButton: IconButton,
  AddWishlistButton: IconButton,
  Alert,
  Rating,
  QuantityField,
  Tooltip: Tooltip,
} as ProductCardProps['elements'], {
  notifierOptions: {
    position: toastify.POSITION.TOP_RIGHT,
    className: notifierStyles.muiToast,
    Wrapper: NotifierWrapper,
  }
} as ProductCardProps);
