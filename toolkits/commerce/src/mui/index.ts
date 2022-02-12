import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import GppBadIcon from '@mui/icons-material/GppBad';
import { Alert, Breadcrumbs as MuiLibBreadcrumbs, Button, IconButton, Rating, TextField, Tooltip } from '@mui/material';
import React from 'react';
import { toast as toastify } from 'react-toastify';

import { Breadcrumbs as BaseBreadcrumbs, BreadcrumbsProps } from '../base/Breadcrumbs/Breadcrumbs';
import { CartList, CartListProps } from '../base/CartList/CartList';
import { CategoryList as BaseCategoryList, CategoryListProps } from '../base/CategoryList/CategoryList';
import { CategorySort as BaseCategorySort } from '../base/CategorySort/CategorySort';
import { Checkout, CheckoutProps } from '../base/Checkout/Checkout';
import { CurrencySwitch, CurrencySwitchProps } from '../base/CurrencySwitch/CurrencySwitch';
import { ProductActions as BaseProductActions, ProductActionsProps } from '../base/ProductActions/ProductActions';
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
import { RadioGroup } from './RadioGroup/RadioGroup';
import { Select } from './Select/Select';

export const MuiPagination = Pagination;

export const MuiBreadcrumbs = withElements(BaseBreadcrumbs, {
  Wrapper: MuiLibBreadcrumbs,
  Breadcrumb: (props) => React.createElement(StyledBreadcrumb, { onClick: () => '', component: "div", ...props, } as any),
} as BreadcrumbsProps['elements']);

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

export const MuiCartList = withElements(CartList, {
  Loadbox,
  Button: IconButton,
} as CartListProps['elements']);


export const MuiCheckout = withElements(Checkout, {
  Loadbox,
  PlacedOrder: (props) => React.createElement(Alert, { severity: "success" }, props.children),
  RadioGroup: RadioGroup,
  Button: Button,
  AddCouponButton: (props) => React.createElement(Button, { style: { marginRight: '15px' }, ...props }),
  RemoveCouponButton: (props) => React.createElement(IconButton, { style: { marginLeft: '10px' }, ...props }),
  CouponAppliedIcon: () => React.createElement(CheckCircleOutlineIcon, {
    style: {
      color: '#357a38',
      marginRight: '15px',
    }
  }),
  CouponProblemIcon: () => React.createElement(GppBadIcon, {
    style: {
      color: '#b2102f',
      marginRight: '15px',
    }
  }),
  RemoveCouponIcon: CloseIcon,
  TextField: (props) => React.createElement(TextField, {
    size: 'small',
    fullWidth: true,
    style: { margin: '10px 0' },
    ...props,
  }),
} as CheckoutProps['elements'], {
  notifierOptions: {
    position: toastify.POSITION.TOP_RIGHT,
    className: notifierStyles.muiToast,
    Wrapper: NotifierWrapper,
  }
} as CheckoutProps);
