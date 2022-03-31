import { useRef } from "react";

export const useBlockFns = () => {
  const getStoreItem = useRef<typeof import("@cromwell/core")["getStoreItem"]>();
  const setStoreItem = useRef<typeof import("@cromwell/core")["setStoreItem"]>();
  const getBlockData = useRef<typeof import("@cromwell/core-frontend")["getBlockData"]>();
  const getBlockElementById = useRef<typeof import("@cromwell/core-frontend")["getBlockElementById"]>();
  const getBlockById = useRef<typeof import("@cromwell/core-frontend")["getBlockById"]>();

  return {
    getStoreItem,
    setStoreItem,
    getBlockData,
    getBlockById,
    getBlockElementById,
  }
}