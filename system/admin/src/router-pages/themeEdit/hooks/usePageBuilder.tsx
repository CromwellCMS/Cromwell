import {
  getRandStr,
  sleep,
  TCromwellBlock,
  TCromwellBlockData,
  TCromwellBlockType,
  TCromwellStore,
  TPageConfig,
} from '@cromwell/core';
import {
  blockCssClass,
  getBlockHtmlType,
  getBlockIdFromHtml,
  getRestApiClient,
  pageRootContainerId,
} from '@cromwell/core-frontend';
import React, { useEffect, useRef, useState } from 'react';

import { askConfirmation } from '../../../components/modal/Confirmation';
import { toast } from '../../../exports';
import { Draggable } from '../../../helpers/Draggable/Draggable';
import { TBlockMenuProps } from '../pageEditor/components/BlockMenu';
import { TExtendedPageInfo } from '../ThemeEdit';
import { useBlockEvents } from './useBlockEvents';
import { useBlockFns } from './useBlockFns';
import { useEditorUtils } from './useEditorUtils';
import { useEditorFrames } from './useHoveredFrames';
import { useThemeEditor } from './useThemeEditor';

export const contentStyles = `
* {
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
    user-drag: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -o-user-select: none;
    user-select: none;
}
`;

type THistoryItem = {
  local: string;
  global: string;
};

// const unsavedPrompt = 'Your unsaved changes will be lost. Do you want to discard and leave this page?';

const usePageBuilderContext = () => {
  const {
    pageFrameRef,
    setChangedModifications,
    // editingPageConfig,
    rerender,
    changedPageInfo,
    changedPalette,
    setChangedPalette,
    plugins,
    editingPageConfig,
    pageConfigOverrides,
    forceUpdate,
    setEditingPageConfig,
    setChangedPageInfo,
    setLoading,
    handleOpenPage,
    themePalette,
    setPageInfos,
    themeName,
  } = useThemeEditor();
  const contentWindowRef = useRef<Window>();
  const editorWidgetWrapperRef = useRef<HTMLDivElement>();
  const editorWidgetWrapperCroppedRef = useRef<HTMLDivElement>();
  const contentStore = useRef<TCromwellStore>();
  const contentFrontend = useRef<typeof import('@cromwell/core-frontend')>();
  const [ignoreDraggableClass] = useState(pageRootContainerId);

  const selectedBlock = useRef<HTMLElement>();
  const selectedEditableBlock = useRef<TCromwellBlock>();

  const [history, setHistory] = useState<THistoryItem[]>([]);
  const [undoneHistory, setUndoneHistory] = useState<THistoryItem[]>([]);

  const [blockInfos, setBlockInfos] = useState<Record<string, { canDrag?: boolean; canDeselect?: boolean }>>({});

  const selectableFrameMargin = 0;

  const canInsertBlock = () => true;

  const { getStoreItem, setStoreItem, getBlockData, getBlockById, getBlockElementById } = useBlockFns();

  const { isGlobalElem, getFrameColor, findEditableParent, checkBlockDataGlobal } = useEditorUtils({
    getBlockData,
    getBlockElementById,
    contentWindowRef,
  });

  const {
    selectedFrames,
    invisibleSelectedFrames,
    onBlockHoverEnd,
    onBlockHoverStart,
    createBlockFrame,
    updateFramesPosition,
    draggable,
    onAnyElementScroll,
  } = useEditorFrames({
    getBlockById,
    getBlockElementById,
    getBlockIdFromHtml,
    getFrameColor,
    editorWidgetWrapperCroppedRef,
    contentWindowRef,
    selectableFrameMargin,
    pageFrameRef,
  });

  const {
    canDeselectBlock,
    canDragBlock,
    selectBlock,
    deselectBlock,
    deselectCurrentBlock,
    onBlockSelected,
    onMouseUp,
    onTryToInsert,
    addBlock,
    onBlockInserted,
  } = useBlockEvents({
    draggable,
    contentWindowRef,
    selectedBlock,
    selectedFrames,
    updateDraggable,
    getBlockById,
    getBlockIdFromHtml,
    findEditableParent,
    selectedEditableBlock,
    invisibleSelectedFrames,
    createBlockFrame,
    getFrameColor,
    editorWidgetWrapperCroppedRef,
    editorWidgetWrapperRef,
    getBlockData,
    getBlockElementById,
    blockInfos,
    checkBlockDataGlobal,
    modifyBlock,
    isGlobalElem,
    rerenderBlocks,
    rerender: forceUpdate,
  });

  const [changedModifications, __setChangedModifications] = useState<TCromwellBlockData[] | null | undefined>(null);

  const updateChangedModifications = (data) => {
    if (data) {
      setChangedModifications(data);
    }
    __setChangedModifications(data);
  };

  useEffect(() => {
    updateFramesPosition();
  }, [rerender]);

  function modifyBlock(blockData: TCromwellBlockData, saveHist?: boolean) {
    if (!changedModifications) updateChangedModifications([]);
    // Save history
    if (saveHist !== false) saveCurrentState();

    // Save to global modifications in pageConfig.
    const pageConfig: TPageConfig = getStoreItem.current('pageConfig') ?? ({} as TPageConfig);
    if (!pageConfig.modifications) pageConfig.modifications = [];
    pageConfig.modifications = addToModifications(blockData, pageConfig.modifications);
    setStoreItem.current('pageConfig', pageConfig);

    // Add to local changedModifications (contains only newly added changes)
    updateChangedModifications(addToModifications(blockData, changedModifications || []));
  }

  function updateDraggable() {
    // console.log("updatedrag", draggable);
    draggable.current?.updateBlocks();
    pageFrameRef.current?.addEventListener('scroll', onAnyElementScroll);
    contentWindowRef.current?.addEventListener('scroll', onAnyElementScroll);

    const allElements = Array.from(contentWindowRef.current?.document?.getElementsByTagName('*') ?? []);
    allElements.forEach((el: HTMLElement) => {
      // Disable all links
      el.onclick = (e) => {
        e.preventDefault();
      };
      el.addEventListener('scroll', onAnyElementScroll);
    });

    updateFramesPosition();
  }

  function addToModifications(data: TCromwellBlockData, mods: TCromwellBlockData[]) {
    let modIndex: number | null = null;
    mods = mods ? mods : [];
    const modifications = [...mods];
    modifications.forEach((mod, i) => {
      if (mod.id === data.id) modIndex = i;
    });
    if (modIndex !== null) {
      modifications[modIndex] = data;
    } else {
      modifications.push(data);
    }
    return modifications;
  }

  function getCurrentModificationsState(): THistoryItem {
    const pageConfig = getStoreItem.current('pageConfig');
    return {
      global: JSON.stringify(pageConfig?.modifications ?? []),
      local: JSON.stringify(changedModifications),
    };
  }

  function saveCurrentState() {
    const current = getCurrentModificationsState();

    if (history[history.length - 1]?.local !== current.local) {
      setHistory([...history, current]);
    }

    // setUndoneHistory([]);

    if (history.length > 20) {
      const [, ...restHistory] = history;
      setHistory([...restHistory]);
    }
  }

  async function rerenderBlocks() {
    const instances = getStoreItem.current('blockInstances');
    const promises: Promise<any>[] = [];
    if (instances) {
      Object.values(instances).forEach((inst) => {
        if (inst?.rerender) {
          const p = inst.rerender();
          if (p) promises.push(p);
        }
      });
    }
    await Promise.all(promises);
    updateDraggable();
  }

  async function applyHistory(history: THistoryItem) {
    const pageConfig = getStoreItem.current('pageConfig')!;
    pageConfig.modifications = JSON.parse(history.global);
    setStoreItem.current('pageConfig', pageConfig);
    // changedModifications = JSON.parse(history.local);
    updateChangedModifications(JSON.parse(history.local));
    await new Promise((done) => setTimeout(done, 10));
    await rerenderBlocks();

    if (selectedBlock.current) selectBlock(getBlockData.current(selectedBlock.current)!);
  }

  function undoModification() {
    // const last = history.pop();
    const [last, ...nxt] = history.reverse();
    if (last) {
      setHistory(nxt.reverse());
      setUndoneHistory([...undoneHistory, getCurrentModificationsState()]);
      applyHistory(last);
    }
  }

  const resetModifications = () => {
    updateChangedModifications(null);
  };

  function redoModification() {
    if (undoneHistory.length > 0) {
      const [last, ...nxt] = undoneHistory.reverse();
      // setHistory([...nxt.reverse()])
      setUndoneHistory(nxt.reverse());
      saveCurrentState();
      applyHistory(last);
    }
  }

  async function deleteBlock(blockData: TCromwellBlockData) {
    if (blockData) {
      blockData.isDeleted = true;
      modifyBlock(blockData);
    }
    deselectBlock(getBlockElementById.current(blockData.id)!);
    await rerenderBlocks();

    draggable.current?.updateBlocks();
  }

  async function createBlockV2(
    blockData: TCromwellBlockData,
    callerBlock: TCromwellBlockData,
    containerData?: TCromwellBlockData,
    position?: 'top' | 'bottom',
  ) {
    const newBlock: TCromwellBlockData = {
      id: `_${getRandStr()}`,
      type: blockData.type,
      isVirtual: true,
      style: {
        minWidth: '50px',
        minHeight: '30px',
      },
    };

    if (blockData.type === 'plugin') {
      newBlock.plugin = blockData.plugin;
    }

    if (containerData && containerData.type !== 'container') containerData = undefined;

    addBlock({
      blockData: newBlock,
      targetBlockData: containerData ? undefined : callerBlock,
      parentData: containerData,
      position: position === 'top' ? 'before' : 'after',
    });

    await rerenderBlocks();

    // Select new block
    setTimeout(() => {
      getBlockElementById.current(newBlock.id)?.click();
      selectBlock(newBlock);
    }, 200);
  }

  async function createNewBlock(
    newBlockType: TCromwellBlockType,
    afterBlockData: TCromwellBlockData,
    containerData?: TCromwellBlockData,
    pluginInfo?: {
      pluginName?: string;
      blockName?: string;
    },
  ) {
    const newBlock: TCromwellBlockData = {
      id: `_${getRandStr()}`,
      type: newBlockType,
      isVirtual: true,
      style: {
        minWidth: '50px',
        minHeight: '30px',
      },
    };

    if (newBlockType === 'plugin' && pluginInfo?.pluginName) {
      newBlock.plugin = {
        pluginName: pluginInfo.pluginName,
      };
    }

    if (containerData && containerData.type !== 'container') containerData = undefined;

    addBlock({
      blockData: newBlock,
      targetBlockData: containerData ? undefined : afterBlockData,
      parentData: containerData,
      position: 'after',
    });

    await rerenderBlocks();

    // Select new block
    setTimeout(() => {
      getBlockElementById.current(newBlock.id)?.click();
      selectBlock(newBlock);
    }, 200);

    return;
  }

  function createBlockProps(block?: TCromwellBlock): TBlockMenuProps {
    const data = block?.getData();
    const bId = data?.id;
    const bType = data?.type;
    const privateDeleteBlock = () => {
      if (!data) return;
      if (!data.global && isGlobalElem(getBlockElementById.current(data?.id)!)) {
        data.global = true;
      }
      deleteBlock(data);
    };
    const handleCreateNewBlock = (
      newBType: TCromwellBlockType,
      pluginInfo?: {
        pluginName?: string;
        blockName?: string;
      },
    ) => {
      if (!data) return;
      return createNewBlock(newBType, data, bType === 'container' ? data : undefined, pluginInfo);
    };

    const handleAddBlock = async (block: TCromwellBlockData, position: 'top' | 'bottom') => {
      if (!data) return;
      return createBlockV2(block, data, block.type === 'container' ? data : undefined, position);
    };

    const blockProps: TBlockMenuProps = {
      block: block,
      getBlockElementById: getBlockElementById.current,
      isGlobalElem: isGlobalElem,
      modifyData: (blockData: TCromwellBlockData) => {
        checkBlockDataGlobal(blockData);
        modifyBlock(blockData);
        block?.rerender();
        if (blockData?.parentId) {
          const parentBlock = getBlockById.current(blockData?.parentId);
          parentBlock?.rerender();
        }
      },
      deleteBlock: privateDeleteBlock,
      addBlock: handleAddBlock,
      addNewBlockAfter: handleCreateNewBlock,
      createBlockAfter: handleCreateNewBlock,
      plugins: plugins,
      setCanDrag: (canDrag: boolean) => {
        if (!bId) return;
        if (!blockInfos[bId]) blockInfos[bId] = {};
        blockInfos[bId].canDrag = canDrag;
        setBlockInfos(blockInfos);
      },
      setCanDeselect: (canDeselect: boolean) => {
        if (!bId) return;
        if (!blockInfos[bId]) blockInfos[bId] = {};
        blockInfos[bId].canDeselect = canDeselect;
        setBlockInfos(blockInfos);
      },
      updateFramesPosition: updateFramesPosition,
    };
    return blockProps;
  }

  async function resetCurrentPage() {
    if (!editingPageConfig?.route) return;
    setChangedPageInfo(false);
    resetModifications();

    if (
      !(await askConfirmation({
        title: `Reset page ${editingPageConfig?.name} ?`,
      }))
    )
      return;

    let success;
    try {
      success = await getRestApiClient()?.resetPage(editingPageConfig.route, themeName);
    } catch (e) {
      console.error(e);
    }

    await handleOpenPage(editingPageConfig);

    if (success) {
      toast.success('Page has been reset');
    } else {
      toast.error('Failed to reset page');
    }
  }

  async function deletePage(pageInfo: TExtendedPageInfo) {
    if (
      !(await askConfirmation({
        title: `Delete page ${pageInfo.name} ?`,
      }))
    )
      return;

    let success;
    if (pageInfo.isSaved === false && typeof pageInfo.isSaved !== 'undefined') {
      success = true;
    } else {
      try {
        success = await getRestApiClient()?.deletePage(pageInfo.route, themeName);
      } catch (error) {
        console.error(error);
      }
    }

    if (success) {
      setPageInfos((prev) => prev.filter((page) => page.id !== pageInfo.id));
      setChangedPageInfo(false);
      toast.success('Page deleted');
    } else {
      toast.error('Failed to delete page');
    }
  }

  async function savePage() {
    if (!hasUnsavedModifications && (editingPageConfig as TExtendedPageInfo)?.isSaved !== false) {
      toast.warning('No changes to save');
      return;
    }

    const hasChangedPalette = changedPalette;

    if (changedPalette && themePalette) {
      try {
        await getRestApiClient().saveThemePalette(themeName, themePalette);
      } catch (error) {
        console.error(error);
      }
      // changedPalette = false;
      setChangedPalette(false);
    }

    const modifications = changedModifications ?? [];

    if (!editingPageConfig) return;

    const pageConfig: TPageConfig & { isSaved?: boolean } = {
      ...editingPageConfig,
      ...pageConfigOverrides,
      modifications,
    };

    delete pageConfig.isSaved;

    const client = getRestApiClient();
    setLoading(true);

    let success;
    try {
      success = await client?.savePageConfig(pageConfig, themeName);
    } catch (error) {
      console.error(error);
    }

    if (success) {
      resetModifications();
      setChangedPageInfo(false);
      toast.success('Saved');

      let hasChangedRoute = false;
      delete (editingPageConfig as TExtendedPageInfo).isSaved;
      setEditingPageConfig({
        ...editingPageConfig,
        ...pageConfigOverrides,
        isSaved: undefined,
      });
      setPageInfos((prev) => {
        return prev.map((page) => {
          if (page.id === pageConfig.id) {
            if (page.route !== pageConfig.route) {
              hasChangedRoute = true;
            }
            return pageConfig;
          }
          return page;
        });
      });

      if (hasChangedRoute || hasChangedPalette) {
        handleOpenPage(pageConfig);
      }
    } else {
      toast.error('Failed to save changes');
    }
    setLoading(false);
  }

  function pageChangeStart() {
    if (pageFrameRef.current) {
      pageFrameRef.current.style.transitionDuration = '0.5s';
      pageFrameRef.current.style.opacity = '0';
    }
  }

  function pageChangeFinish() {
    if (pageFrameRef.current) {
      setTimeout(() => {
        pageFrameRef.current!.style.opacity = '1';
      }, 100);
    }
  }

  async function onPageChange() {
    // console.log("PAGE CHANGE")
    if (!pageFrameRef.current) return;
    setHistory([]);
    setUndoneHistory([]);
    deselectCurrentBlock();
    pageChangeStart();
    await sleep(0.2);
    contentWindowRef.current = pageFrameRef.current.contentWindow!;
    // console.log(contentWindowRef.current.origin)
    editorWidgetWrapperRef.current = document.getElementById('editorWidgetWrapper') as HTMLDivElement;
    editorWidgetWrapperCroppedRef.current = document.getElementById('editorWidgetWrapperCropped') as HTMLDivElement;

    const waitForModules = async () => {
      if (
        !contentWindowRef.current?.CromwellStore?.nodeModules?.modules?.['@cromwell/core-frontend'] ||
        !contentWindowRef.current?.CromwellStore?.forceUpdatePage
      ) {
        await sleep(0.2);
        await waitForModules();
      }
    };

    await waitForModules();

    // console.log("MODULES DONE");

    contentWindowRef.current.document.body.style.userSelect = 'none';
    contentStore.current = contentWindowRef.current.CromwellStore;

    // console.log(contentWindowRef.current, contentStore.current)
    contentFrontend.current = contentStore.current.nodeModules?.modules?.['@cromwell/core-frontend'];
    // if (contentFrontend.current) {
    getBlockElementById.current = contentFrontend.current?.getBlockElementById || getBlockElementById.current;
    getBlockData.current = contentFrontend.current?.getBlockData || getBlockData.current;
    getBlockById.current = contentFrontend.current?.getBlockById || getBlockById.current;
    // }

    getStoreItem.current = contentStore.current.nodeModules?.modules?.['@cromwell/core'].getStoreItem;
    setStoreItem.current = contentStore.current.nodeModules?.modules?.['@cromwell/core'].setStoreItem;

    // const getBlockElementId_ = contentFrontend.current.getBlockElementById
    // const getBlockData_ = contentFrontend.current.getBlockData
    const getBlockById_ = contentFrontend.current.getBlockById;
    // const getStoreItem_ = contentStore.current.nodeModules?.modules?.['@cromwell/core'].getStoreItem
    // const setStoreItem_ = contentStore.current.nodeModules?.modules?.['@cromwell/core'].setStoreItem

    draggable.current = new Draggable({
      document: contentWindowRef.current.document,
      draggableSelector: `.${blockCssClass}`,
      containerSelector: `.${getBlockHtmlType('container')}`,
      rootElement: contentWindowRef.current.document.getElementById('CB_root'),
      disableInsert: true,
      ignoreDraggableClass: ignoreDraggableClass,
      canInsertBlock: canInsertBlock,
      onBlockInserted: onBlockInserted,
      onBlockSelected: onBlockSelected,
      // onBlockDeSelected: onBlockDeSelected,
      canDeselectBlock: canDeselectBlock,
      canDragBlock: canDragBlock,
      getFrameColor: getFrameColor,
      onBlockHoverStart: onBlockHoverStart,
      onBlockHoverEnd: onBlockHoverEnd,
      onTryToInsert: onTryToInsert,
      dragPlacement: 'underline',
      disableClickAwayDeselect: true,
    });

    const styles = contentWindowRef.current.document.createElement('style');
    styles.innerHTML = contentStyles;
    contentWindowRef.current.document.head.appendChild(styles);

    const rootBlock = getBlockById_(pageRootContainerId);
    if (rootBlock)
      rootBlock.addDidUpdateListener('PageBuilder', () => {
        updateDraggable();
      });

    document.body.addEventListener('mouseup', onMouseUp);
    // checkHistoryButtons();
    updateDraggable();
    pageChangeFinish();
    // pageChangeFinish();
  }

  const hasUnsavedModifications = changedPalette || !!(changedPageInfo || changedModifications?.length > 0);

  return {
    onPageChange,
    deselectBlock,
    createBlockProps,
    selectedBlock,
    undoModification,
    redoModification,
    selectedEditableBlock,
    updateFramesPosition,
    selectedFrames,
    changedModifications,
    deletePage,
    hasUnsavedModifications,
    history,
    undoneHistory,
    savePage,
    resetCurrentPage,
  };
};

export const usePageBuilder = () => {
  return React.useContext(PageBuilderContext);
};

type ContextType = ReturnType<typeof usePageBuilderContext>;
const Empty = {} as ContextType;

const PageBuilderContext = React.createContext<ContextType>(Empty);

export const PageBuilderProvider = ({ children }) => {
  const value = usePageBuilderContext();

  return <PageBuilderContext.Provider value={value}>{children}</PageBuilderContext.Provider>;
};
