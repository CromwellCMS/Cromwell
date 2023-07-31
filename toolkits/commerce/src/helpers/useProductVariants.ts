import { TProduct } from '@cromwell/core';
import { useForceUpdate } from '@cromwell/core-frontend';
import { useEffect, useRef } from 'react';

import { useModuleState } from './state';

/**
 * A hook that will track selection of product attributes by user and apply
 * product variants, so returned value will be modified product (new object).
 * Store this value in a separate variable and do not pass this modified value back.
 * @param original Original, unmodified product
 */
export const useProductVariants = (original?: TProduct | null): TProduct => {
  const moduleState = useModuleState();
  const productRef = useRef(original);
  const modifiedProductRef = useRef(original);
  const forceUpdate = useForceUpdate();

  if (original && original.id !== productRef.current?.id) {
    productRef.current = original;
    modifiedProductRef.current = original;
  }

  useEffect(() => {
    const onUpdateId =
      productRef.current?.id &&
      moduleState.addOnProductUpdateListener(productRef.current.id, () => {
        const modified = moduleState.products[productRef.current!.id]?.modifiedProduct ?? productRef.current;
        if (modified) {
          modifiedProductRef.current = modified;
          forceUpdate();
        }
      });

    return () => {
      if (productRef.current?.id) {
        delete moduleState.products[productRef.current?.id];
        if (onUpdateId) moduleState.removeOnProductUpdateListener(productRef.current?.id, onUpdateId);
      }
    };
  }, [productRef.current]);

  return modifiedProductRef.current!;
};
