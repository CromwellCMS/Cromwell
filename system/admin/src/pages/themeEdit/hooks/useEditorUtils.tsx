import { TCromwellBlockData } from '@cromwell/core';

export const useEditorUtils = ({ getBlockData, getBlockElementById, contentWindowRef }) => {
  const isGlobalElem = (elem?: HTMLElement): boolean => {
    if (!elem) return false;
    const data = getBlockData.current(elem);
    if (data?.global) return true;
    if (data?.id === 'root') return false;
    const parent = elem?.parentElement;
    if (parent) {
      return isGlobalElem(parent);
    }
    return false;
  };

  const findEditableParent = (elem?: HTMLElement): HTMLElement | undefined => {
    if (!elem) return undefined;
    if (elem === contentWindowRef.current.document.body) return;

    const data = getBlockData.current(elem);
    if (data?.id === 'root') return;
    if (data && !data.editorHidden) return elem;

    const parent = elem?.parentElement;
    if (parent) {
      return findEditableParent(parent);
    }
    return;
  };

  const getFrameColor = (elem: HTMLElement) => {
    if (isGlobalElem(elem)) return '#ff9100';
    return '#9900CC';
  };

  const checkBlockDataGlobal = (blockData: TCromwellBlockData) => {
    if (isGlobalElem(getBlockElementById.current(blockData?.id))) {
      blockData.global = true;
    } else {
      delete blockData.global;
    }
  };

  return {
    isGlobalElem,
    getFrameColor,
    findEditableParent,
    checkBlockDataGlobal,
  };
};
