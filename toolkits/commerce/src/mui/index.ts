import { Alert, Breadcrumbs as MuiLibBreadcrumbs, Button, IconButton, Rating, TextField, Tooltip } from '@mui/material';
import React from 'react';
import { toast as toastify } from 'react-toastify';

import { BreadcrumbElements, Breadcrumbs as BaseBreadcrumbs } from '../base/Breadcrumbs/Breadcrumbs';
import { CategoryList as BaseCategoryList, CategoryListProps } from '../base/CategoryList/CategoryList';
import { CategorySort as BaseCategorySort } from '../base/CategorySort/CategorySort';
import { ProductActions as BaseProductActions, ProductActionsProps } from '../base/ProductActions/ProductActions';
import { CurrencySwitch, CurrencySwitchProps } from '../base/CurrencySwitch/CurrencySwitch';
import {
  ProductAttributes as BaseProductAttributes,
  ProductAttributesProps,
} from '../base/ProductAttributes/ProductAttributes';
import { ProductCard as BaseProductCard, ProductCardProps } from '../base/ProductCard/ProductCard';
import { ProductReviews as BaseProductReviews, ProductReviewsProps } from '../base/ProductReviews/ProductReviews';
import { ProductSearch as BaseProductSearch, ProductSearchProps } from '../base/ProductSearch/ProductSearch';
import { ViewedItems, ViewedItemsProps } from '../base/ViewedItems/ViewedItems';
import { Wishlist, WishlistProps } from '../base/Wishlist/Wishlist';
import { withElements } from '../helpers/withElements';
import { StyledBreadcrumb } from './Breadcrumbs/Breadcrumbs';
import { Loadbox } from './Loadbox/Loadbox';
import { NotifierWrapper } from './Notifier/Notifier';
import notifierStyles from './Notifier/Notifier.module.scss';
import { Pagination } from './Pagination/Pagination';
import { Popper } from './Popper/Popper';
import { ActionButton } from './ProductActions/ProductActions';
import { AttributeTitle } from './ProductAttributes/AttributeTitle';
import { AttributeValue } from './ProductAttributes/AttributeValue';
import { QuantityField } from './QuantityField/QuantityField';
import { Select } from './Select/Select';

export const MuiPagination = Pagination;

export const MuiBreadcrumbs = withElements(BaseBreadcrumbs, {
  Wrapper: MuiLibBreadcrumbs,
  Breadcrumb: (props) => React.createElement(StyledBreadcrumb, { onClick: () => '', component: "div", ...props, } as any),
} as BreadcrumbElements);

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


// To avoid passing `cardProps` prop by ProductCard to IconButton which results 
// in passing `cardProps` to a base DOM element and React showing warning.
const CustomIconButton = (props) => React.createElement(IconButton, {
  onClick: props.onClick,
  'aria-label': props['aria-label'],
  className: props.className,
}, props.children);

export const MuiProductCard = withElements(BaseProductCard, {
  Button: CustomIconButton,
  AddCartButton: CustomIconButton,
  AddWishlistButton: CustomIconButton,
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

export const MuiCategoryList = withElements(BaseCategoryList, {
  Pagination,
  ProductCard: MuiProductCard,
} as CategoryListProps['elements']);

export const MuiCategorySort = withElements(BaseCategorySort, {
  Select,
});

export const MuiProductSearch = withElements(BaseProductSearch, {
  Popper,
  TextField: (props) => React.createElement(TextField, {
    variant: 'outlined',
    fullWidth: true,
    size: 'small',
    ...props,
  }),
} as ProductSearchProps['elements']);

export const MuiWishlist = withElements(Wishlist, {
  Loadbox,
  ProductCard: MuiProductCard,
} as WishlistProps['elements']);

export const MuiViewedItems = withElements(ViewedItems, {
  Loadbox,
  ProductCard: MuiProductCard,
} as ViewedItemsProps['elements']);

export const MuiCurrencySwitch = withElements(CurrencySwitch, {
  Select: (props) => React.createElement(Select, {
    variant: 'standard',
    color: 'primary',
    onChange: props.onChange as any,
    ...props,
  }),
} as CurrencySwitchProps['elements']);

