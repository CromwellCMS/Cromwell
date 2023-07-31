import {
  payLaterOption,
  resolvePageRoute,
  setStoreItem,
  standardShipping,
  TOrder,
  TOrderInput,
  TProduct,
  TProductReview,
  TProductVariant,
  TStoreListItem,
} from '@cromwell/core';
import {
  applyDataFilters,
  AttributeRepository,
  CouponRepository,
  getCmsSettings,
  getEmailTemplate,
  getLogger,
  getThemeConfigs,
  OrderRepository,
  ProductRepository,
  ProductReviewInput,
  ProductReviewRepository,
  sendEmail,
} from '@cromwell/core-backend';
import { getCStore } from '@cromwell/core-frontend';
import { HttpException, HttpStatus } from '@nestjs/common';
import { format } from 'date-fns';
import { Service } from 'typedi';
import { getCustomRepository } from 'typeorm';

import { CreateOrderDto } from '../dto/create-order.dto';
import { OrderTotalDto } from '../dto/order-total.dto';
import { serverFireAction } from '../helpers/server-fire-action';

const logger = getLogger();

@Service()
export class StoreService {
  async calcOrderTotal(input: CreateOrderDto): Promise<OrderTotalDto> {
    const orderTotal = new OrderTotalDto();
    orderTotal.successUrl = input.successUrl;
    orderTotal.cancelUrl = input.cancelUrl;
    orderTotal.fromUrl = input.fromUrl;
    orderTotal.currency = input.currency;

    let cart: TStoreListItem[] | undefined;
    try {
      if (typeof input.cart === 'string') {
        cart = JSON.parse(input.cart);
      } else if (typeof input.cart === 'object') {
        cart = input.cart;
      }
    } catch (error) {
      logger.error('placeOrder: Failed to parse cart', error);
    }
    if (typeof cart !== 'object') return orderTotal;

    const settings = await getCmsSettings();

    const cstore = getCStore({
      local: true,
      apiClient: {
        getProductById: (id) =>
          getCustomRepository(ProductRepository).getProductById(id, {
            withAttributes: true,
            withCategories: true,
            withVariants: true,
          }),
        getCouponsByCodes: (codes) => getCustomRepository(CouponRepository).getCouponsByCodes(codes),
      },
    });

    if (input.currency) {
      cstore.setActiveCurrency(input.currency);
    }

    cstore.saveCart(cart);
    await cstore.applyCouponCodes(input.couponCodes);

    const attributes = await getCustomRepository(AttributeRepository).getAll();
    await cstore.updateCart(attributes);

    const total = cstore.getCartTotal();

    orderTotal.cart = cstore.getCart();
    orderTotal.cartOldTotalPrice = total.totalOld;
    orderTotal.cartTotalPrice = total.total ?? 0;
    orderTotal.totalQnt = total.amount;
    orderTotal.appliedCoupons = total.coupons.map((coupon) => coupon.code!);

    orderTotal.shippingPrice = settings?.defaultShippingPrice ? parseFloat(settings?.defaultShippingPrice + '') : 0;
    orderTotal.shippingPrice = parseFloat(orderTotal.shippingPrice.toFixed(2));

    orderTotal.orderTotalPrice = (orderTotal?.cartTotalPrice ?? 0) + (orderTotal?.shippingPrice ?? 0);
    orderTotal.orderTotalPrice = parseFloat(orderTotal.orderTotalPrice.toFixed(2));

    orderTotal.shippingOptions = [
      {
        ...standardShipping,
        price: settings?.defaultShippingPrice,
      },
    ];

    return orderTotal;
  }

  async createPaymentSession(input: CreateOrderDto): Promise<OrderTotalDto> {
    const total = await this.calcOrderTotal(input);
    total.cart = total.cart?.filter((item) => item?.product);

    if (!total.cart?.length) throw new HttpException('Cart is invalid or empty', HttpStatus.BAD_REQUEST);
    const settings = await getCmsSettings();

    const payments = await serverFireAction('create_payment', total);
    total.paymentOptions = [...Object.values(payments ?? {}), ...(!settings?.disablePayLater ? [payLaterOption] : [])];

    return total;
  }

  async placeOrder(input: CreateOrderDto): Promise<TOrder | undefined> {
    const orderTotal = await this.calcOrderTotal(input);
    if (!Array.isArray(orderTotal.cart) || !orderTotal.cart?.length)
      throw new HttpException('Cart is invalid or empty', HttpStatus.BAD_REQUEST);

    const settings = await getCmsSettings();
    const { themeConfig } = (settings?.themeName && (await getThemeConfigs(settings?.themeName))) || {};

    // Clean up products
    if (orderTotal.cart?.length) {
      orderTotal.cart = orderTotal.cart
        .map((item) => {
          if (item.pickedAttributes) {
            const pickedAttributes = {};
            Object.keys(item.pickedAttributes).forEach((key, index) => {
              if (index > 100) return;
              if (!item.pickedAttributes![key]?.length) return;
              if (item.pickedAttributes![key].length > 100) return;
              pickedAttributes[key] = item.pickedAttributes![key];
            });
            if (JSON.stringify(pickedAttributes).length < 10000) item.pickedAttributes = pickedAttributes;
          }

          if (item.product)
            item.product = {
              id: item.product.id,
              createDate: item.product.createDate,
              updateDate: item.product.updateDate,
              name: item.product.name,
              mainCategoryId: item.product.mainCategoryId,
              price: item.product.price,
              oldPrice: item.product.oldPrice,
              sku: item.product.sku,
              mainImage: item.product.mainImage,
              images: item.product.images?.slice(0, 3),
              attributes: item.product.attributes,
              stockAmount: item.product.stockAmount,
              stockStatus: item.product.stockStatus,
            };
          const pureItem: TStoreListItem = {
            amount: item.amount,
            pickedAttributes: item.pickedAttributes,
            product: item.product,
          };
          if (JSON.stringify(pureItem).length > 20000) return null;
          return pureItem;
        })
        .filter(Boolean) as TStoreListItem[];
    }

    const attributes = await getCustomRepository(AttributeRepository).getAll();

    // Update stock of products / product variants
    await Promise.all(
      orderTotal.cart?.map(async (item) => {
        const product =
          (item.product?.id &&
            (await getCustomRepository(ProductRepository).getProductById(item.product.id, { withVariants: true }))) ||
          null;

        if (!product) return;

        const decreaseStock = (product: TProduct | TProductVariant) => {
          if (product.manageStock && product.stockAmount) {
            product.stockAmount = product.stockAmount - (item.amount ?? 1);
            if (product.stockAmount < 0) {
              throw new HttpException(
                `Product ${product.name ?? item.product?.name} is not available in amount ${item.amount ?? 1}`,
                HttpStatus.BAD_REQUEST,
              );
            }

            if (product.stockAmount === 0) {
              product.stockStatus = 'Out of stock';
            }
          }
        };

        if (!item.pickedAttributes) {
          // Manage stock of main product record
          decreaseStock(product);
        } else {
          // Manage product variants
          // Find picked variant (if it is created)
          const variant = product?.variants?.find((variant) => {
            return Object.entries(item.pickedAttributes ?? {}).every(([key, values]) => {
              const attribute = attributes.find((attr) => attr.key === key);
              if (attribute?.type === 'radio') return variant.attributes?.[key] === values[0];

              // Attribute type `checkbox` is not supported for auto management
              return false;
            });
          });

          if (variant) {
            decreaseStock(variant);
          } else {
            // Variant not found, use main product info
            decreaseStock(product);
          }
        }
        await product?.save();
      }),
    );

    // Apply coupons
    if (orderTotal.appliedCoupons?.length) {
      try {
        const coupons = await getCustomRepository(CouponRepository).getCouponsByCodes(orderTotal.appliedCoupons);

        for (const coupon of coupons ?? []) {
          if (!coupon.usedTimes) coupon.usedTimes = 1;
          else coupon.usedTimes++;
          await coupon.save();
        }
      } catch (error) {
        logger.error(error);
      }
    }

    // Prevent metadata spam
    let customMeta;
    if (typeof input.customMeta === 'object' && Object.keys(input.customMeta).length < 100) {
      for (const [key, value] of Object.entries(input.customMeta)) {
        if (key.length < 100 && String(value).length < 10000) {
          customMeta[key] = value;
        }
      }
    }

    const createOrder: TOrderInput = {
      cartOldTotalPrice: orderTotal.cartOldTotalPrice,
      cartTotalPrice: orderTotal.cartTotalPrice,
      totalQnt: orderTotal.totalQnt,
      shippingPrice: orderTotal.shippingPrice,
      orderTotalPrice: orderTotal.orderTotalPrice,
      couponCodes: orderTotal.appliedCoupons,
      cart: orderTotal.cart,
      status: 'Pending',
      userId: input.userId,
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      customerEmail: input.customerEmail,
      customerAddress: input.customerAddress,
      customerComment: input.customerComment,
      shippingMethod: input.shippingMethod,
      paymentMethod: input.paymentMethod,
      fromUrl: input.fromUrl,
      currency: input.currency,
      customMeta,
    };

    if (JSON.stringify(createOrder).length > 20000) {
      throw new HttpException('Some input field is too long', HttpStatus.BAD_REQUEST);
    }

    const fromUrl = input.fromUrl;
    const cstore = getCStore({ local: true });
    if (createOrder.currency) {
      cstore.setActiveCurrency(createOrder.currency);
    }

    // < Send e-mail >
    setStoreItem('defaultPages', themeConfig?.defaultPages);
    try {
      if (input.customerEmail && fromUrl) {
        const mailProps = {
          createDate: format(new Date(Date.now()), 'd MMMM yyyy'),
          logoUrl: settings?.logo && fromUrl + '/' + settings.logo,
          orderLink: themeConfig?.defaultPages?.account && fromUrl + '/' + themeConfig.defaultPages.account,
          totalPrice: cstore.getPriceWithCurrency((orderTotal.orderTotalPrice ?? 0).toFixed(2)),
          unsubscribeUrl: fromUrl,
          products: (orderTotal.cart ?? []).map((item) => {
            return {
              link:
                themeConfig?.defaultPages?.product && fromUrl && (item?.product?.slug || item?.product?.id)
                  ? new URL(fromUrl).origin +
                    resolvePageRoute('product', { slug: item.product.slug || item?.product?.id })
                  : '',
              title: `${item?.amount ? item.amount + ' x ' : ''}${item?.product?.name ?? ''}`,
              price: cstore.getPriceWithCurrency(((item.product?.price ?? 0) * (item.amount ?? 1)).toFixed(2)),
            };
          }),
          shippingPrice: cstore.getPriceWithCurrency((orderTotal.shippingPrice ?? 0).toFixed(2)),
        };

        const compiledEmail = await getEmailTemplate('order.hbs', mailProps);
        if (!compiledEmail) {
          logger.error('order.hbs template was not found');
          throw new HttpException('order.hbs template was not found', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        await sendEmail([input.customerEmail], 'Order', compiledEmail);
      }
    } catch (error) {
      logger.error(error);
    }
    // < / Send e-mail >

    const createOrderFiltered = (
      await applyDataFilters('Order', 'createInput', {
        data: createOrder,
        permissions: [],
      })
    ).data;
    const createdOrder = await getCustomRepository(OrderRepository).createOrder(createOrderFiltered);
    return (
      await applyDataFilters('Order', 'createOutput', {
        data: createdOrder,
        permissions: [],
        input: createOrderFiltered,
      })
    ).data;
  }

  async placeProductReview(input: ProductReviewInput): Promise<TProductReview> {
    if (JSON.stringify(input).length > 10000) {
      throw new HttpException('Some input field is too long', HttpStatus.BAD_REQUEST);
    }
    const inputFiltered = (
      await applyDataFilters('ProductReview', 'createInput', {
        data: input,
        permissions: [],
      })
    ).data;

    const review = await getCustomRepository(ProductReviewRepository).createProductReview(inputFiltered);
    return (
      await applyDataFilters('ProductReview', 'createOutput', { data: review, permissions: [], input: inputFiltered })
    ).data;
  }
}
