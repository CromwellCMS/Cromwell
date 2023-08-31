import { useRef } from 'react';

export const useBlockFns = () => {
  const noInitWarning = () => {
    console.warn('useBlockFns() is not initialized');
    return undefined;
  };
  const getStoreItem = useRef<typeof import('@cromwell/core')['getStoreItem']>(noInitWarning);
  const setStoreItem = useRef<typeof import('@cromwell/core')['setStoreItem']>(noInitWarning);
  const getBlockData = useRef<typeof import('@cromwell/core-frontend')['getBlockData']>(noInitWarning);
  const getBlockElementById = useRef<typeof import('@cromwell/core-frontend')['getBlockElementById']>(noInitWarning);
  const getBlockById = useRef<typeof import('@cromwell/core-frontend')['getBlockById']>(noInitWarning);

  return {
    getStoreItem,
    setStoreItem,
    getBlockData,
    getBlockById,
    getBlockElementById,
  };
};
