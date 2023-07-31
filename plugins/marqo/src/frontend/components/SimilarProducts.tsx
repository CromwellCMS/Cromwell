import { ESharedComponentNames, getSharedComponent, TProduct } from '@cromwell/core';
import { LoadBox, useForceUpdate } from '@cromwell/core-frontend';
import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

import { DefaultProductCard } from './ProductCard';
import { queryMarqo } from '../utils';

const triggerId = '@cromwell/plugin-marqo__auto-load-trigger';
const rootId = '@cromwell/plugin-marqo__root';

/**
 * Will load similar products based on current <h1/> on the page, when scrolled into view. When user
 * keep scrolling down, more products will be loaded. If limit is not specified, will
 * load all available products from DB.
 */
export function SimilarProducts(props: { autoLoadFirstPageAfter?: number; limit?: number; excludeIds?: number[] }) {
  const pageRef = useRef<number>(1);
  const productsRef = useRef<TProduct[]>([]);
  const productIds = useRef<Record<string, boolean>>({});
  const hasMoreItems = useRef<boolean>(true);
  const loading = useRef<boolean>(false);
  const isTriggerVisible = useRef<boolean>(false);
  const productWidthRef = useRef<number>(1 / 2);
  const router = useRouter();
  const slugRef = useRef<string>(router?.query?.slug as any);
  const forceUpdate = useForceUpdate();
  const autoLoadTimerRef = useRef<any>();

  const getSimilarProducts = async () => {
    if (!hasMoreItems.current) return;
    if (loading.current) return;
    const trigger = document.getElementById(triggerId);
    if (!trigger) return;

    loading.current = true;
    forceUpdate();

    const h1 = document.querySelector('h1');
    if (!h1) return;

    const list = await queryMarqo({
      query: h1.innerText,
      page: pageRef.current,
    });

    if (!list?.elements?.length) {
      hasMoreItems.current = false;
    }

    for (const product of list?.elements ?? []) {
      if (productIds.current[product.id]) continue;
      if (product.name === h1.innerText) continue;
      if (props.excludeIds?.length && props.excludeIds?.includes(product.id)) continue;
      productIds.current[product.id] = true;
      productsRef.current.push(product);

      if (props.limit && productsRef.current.length >= props.limit) {
        hasMoreItems.current = false;
        break;
      }
    }

    loading.current = false;
    pageRef.current++;

    forceUpdate();
  };

  useEffect(() => {
    if (slugRef.current !== router?.query?.slug) {
      slugRef.current = router?.query?.slug as any;
      pageRef.current = 1;
      productsRef.current = [];
      productIds.current = {};
      hasMoreItems.current = true;
      loading.current = false;
      isTriggerVisible.current = false;

      if (autoLoadTimerRef.current) clearTimeout(autoLoadTimerRef.current);

      forceUpdate();

      if (props.autoLoadFirstPageAfter) {
        autoLoadTimerRef.current = setTimeout(() => {
          getSimilarProducts();
        }, props.autoLoadFirstPageAfter);
      }
    }
  }, [router?.query?.slug]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isTriggerVisible.current) {
        getSimilarProducts();
      }
    }, 500);

    if (props.autoLoadFirstPageAfter) {
      autoLoadTimerRef.current = setTimeout(() => {
        getSimilarProducts();
      }, props.autoLoadFirstPageAfter);
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          getSimilarProducts();
          isTriggerVisible.current = true;
        } else {
          isTriggerVisible.current = false;
        }
      });
    });

    // Start observing an element
    const trigger = document.getElementById(triggerId);
    if (trigger) observer.observe(trigger);

    return () => {
      if (trigger) observer.unobserve(trigger);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const root = document.getElementById(rootId);
    if (root) {
      if (root.clientWidth > 1000) {
        productWidthRef.current = 1 / 4;
      } else if (root.clientWidth > 600) {
        productWidthRef.current = 1 / 3;
      } else {
        productWidthRef.current = 1 / 2;
      }
    }
  });

  // Try to load component if a Theme has already defined common Product view
  const ProductComp: React.ComponentType<{ product: TProduct }> =
    getSharedComponent(ESharedComponentNames.ProductCard) ||
    // Default view otherwise
    DefaultProductCard;

  return (
    <div
      id={rootId}
      style={{
        width: '100%',
        height: '100%',
        padding: '10px 0',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        {productsRef.current.map((product) => (
          <div
            key={product.id}
            style={{
              padding: '10px',
              width: `${productWidthRef.current * 100}%`,
            }}
          >
            <ProductComp product={product} />
          </div>
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {loading.current && <LoadBox size={100} />}
      </div>
      <div id={triggerId}></div>
    </div>
  );
}
