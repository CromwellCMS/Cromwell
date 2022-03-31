import {
  getRandStr,
  sleep,
  TCromwellBlock,
  TCromwellBlockData,
  TCromwellBlockType,
  TCromwellStore,
  TPageConfig,
  TPluginEntity,
} from "@cromwell/core";
import {
  blockCssClass,
  getBlockHtmlType,
  getBlockIdFromHtml,
  pageRootContainerId,
} from "@cromwell/core-frontend";
import React, { useEffect, useRef, useState } from "react";
import { Draggable } from "../../../helpers/Draggable/Draggable";
import {
  BlockMenu,
  TBlockMenuProps,
} from "../pageBuilder/blocks/BlockMenu";
import { contentStyles } from "../pageBuilder/contentStyles";
import { useBlockEvents } from "./useBlockEvents";
import { useBlockFns } from "./useBlockFns";
import { useEditorUtils } from "./useEditorUtils";
import { useEditorFrames } from "./useHoveredFrames";
import { useThemeEditor } from "./useThemeEditor";

type THistoryItem = {
  local: string;
  global: string;
};

const usePageBuilderContext = () => {
  const {
    pageFrameRef,
    setChangedModifications,
    // editingPageConfig,
    rerender,
    plugins,
  } = useThemeEditor();
  const contentWindowRef = useRef<Window>();
  const editorWidgetWrapperRef = useRef<HTMLDivElement>();
  const editorWidgetWrapperCroppedRef =
    useRef<HTMLDivElement>();
  const contentStore = useRef<TCromwellStore>();
  const contentFrontend =
    useRef<typeof import("@cromwell/core-frontend")>();
  const [ignoreDraggableClass] = useState(
    pageRootContainerId,
  );

  const selectedBlock = useRef<HTMLElement>();
  const selectedEditableBlock = useRef<TCromwellBlock>();

  // const blockMenu = useRef<BlockMenu>();
  const [history, setHistory] = useState<THistoryItem[]>(
    [],
  );
  const [undoneHistory, setUndoneHistory] = useState<
    THistoryItem[]
  >([]);

  const [blockInfos, setBlockInfos] = useState<
    Record<
      string,
      { canDrag?: boolean; canDeselect?: boolean }
    >
  >({});

  const selectableFrameMargin = 0;

  const canInsertBlock = () => true;

  const {
    getStoreItem,
    setStoreItem,
    getBlockData,
    getBlockById,
    getBlockElementById,
  } = useBlockFns();

  const {
    isGlobalElem,
    getFrameColor,
    findEditableParent,
    checkBlockDataGlobal,
  } = useEditorUtils({
    getBlockData,
    getBlockElementById,
    contentWindowRef,
  });

  const {
    hoveredFrames,
    selectedFrames,
    invisibleSelectedFrames,
    onBlockHoverEnd,
    onBlockHoverStart,
    createBlockFrame,
    updateFramesPosition,
    draggable,
    setDraggable,
    onAnyElementScroll,
    setFramePosition,
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
    onBlockDeSelected,
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
  });

  const [changedModifications, __setChangedModifications] =
    useState<TCromwellBlockData[] | null | undefined>(null);

  const updateChangedModifications = (data) => {
    if (data) {
      setChangedModifications(data);
    }
    __setChangedModifications(data);
  };

  useEffect(() => {
    updateFramesPosition();
  }, [rerender]);

  function modifyBlock(
    blockData: TCromwellBlockData,
    saveHist?: boolean,
  ) {
    if (!changedModifications)
      __setChangedModifications([]);
    // Save history
    if (saveHist !== false) saveCurrentState();

    // Save to global modifications in pageConfig.
    const pageConfig: TPageConfig =
      getStoreItem.current("pageConfig") ??
      ({} as TPageConfig);
    if (!pageConfig.modifications)
      pageConfig.modifications = [];
    pageConfig.modifications = addToModifications(
      blockData,
      pageConfig.modifications,
    );
    setStoreItem.current("pageConfig", pageConfig);

    // Add to local changedModifications (contains only newly added changes)
    __setChangedModifications(
      addToModifications(blockData, changedModifications),
    );
  }

  function updateDraggable() {
    // console.log("updatedrag", draggable);
    draggable?.updateBlocks();
    pageFrameRef.current?.addEventListener(
      "scroll",
      onAnyElementScroll,
    );
    contentWindowRef.current?.addEventListener(
      "scroll",
      onAnyElementScroll,
    );

    const allElements = Array.from(
      contentWindowRef.current.document.getElementsByTagName(
        "*",
      ) ?? [],
    );
    allElements.forEach((el: HTMLElement) => {
      // Disable all links
      el.onclick = (e) => {
        e.preventDefault();
      };
      el.addEventListener("scroll", onAnyElementScroll);
    });

    updateFramesPosition();
  }

  function addToModifications(
    data: TCromwellBlockData,
    mods: TCromwellBlockData[],
  ) {
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
    const pageConfig = getStoreItem.current("pageConfig");
    return {
      global: JSON.stringify(
        pageConfig?.modifications ?? [],
      ),
      local: JSON.stringify(changedModifications),
    };
  }

  function saveCurrentState() {
    const current = getCurrentModificationsState();

    if (
      history[history.length - 1]?.local !== current.local
    ) {
      history.push(current);
    }

    // undoneHistory = [];
    setUndoneHistory([]);

    if (history.length > 20) {
      history.shift();
    }
    setHistory(history);
  }

  async function rerenderBlocks() {
    const instances = getStoreItem.current(
      "blockInstances",
    );
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
    const pageConfig = getStoreItem.current("pageConfig");
    pageConfig.modifications = JSON.parse(history.global);
    setStoreItem.current("pageConfig", pageConfig);
    // changedModifications = JSON.parse(history.local);
    __setChangedModifications(JSON.parse(history.local));
    await new Promise((done) => setTimeout(done, 100));
    await rerenderBlocks();

    if (selectedBlock.current)
      selectBlock(
        getBlockData.current(selectedBlock.current),
      );
  }

  function undoModification() {
    const last = history.pop();
    if (last) {
      undoneHistory.push(getCurrentModificationsState());
      setUndoneHistory(undoneHistory);
      applyHistory(last);
    }
  }

  function redoModification() {
    if (undoneHistory.length > 0) {
      const last = undoneHistory.pop();
      saveCurrentState();
      applyHistory(last);
    }
  }

  async function deleteBlock(
    blockData: TCromwellBlockData,
  ) {
    if (blockData) {
      blockData.isDeleted = true;
      modifyBlock(blockData);
    }
    deselectBlock(
      getBlockElementById.current(blockData.id),
    );
    await rerenderBlocks();

    draggable?.updateBlocks();
  }

  async function createNewBlock(
    newBlockType: TCromwellBlockType,
    afterBlockData: TCromwellBlockData,
    containerData?: TCromwellBlockData,
  ) {
    const newBlock: TCromwellBlockData = {
      id: `_${getRandStr()}`,
      type: newBlockType,
      isVirtual: true,
      style: {
        minWidth: "50px",
        minHeight: "30px",
      },
    };
    if (containerData && containerData.type !== "container")
      containerData = undefined;

    addBlock({
      blockData: newBlock,
      targetBlockData: containerData
        ? undefined
        : afterBlockData,
      parentData: containerData,
      position: "after",
    });

    await rerenderBlocks();

    // Select new block
    setTimeout(() => {
      getBlockElementById.current(newBlock.id)?.click();
      selectBlock(newBlock);
    }, 200);
  }

  function createBlockProps(
    block?: TCromwellBlock,
  ): TBlockMenuProps {
    const data = block?.getData();
    const bId = data?.id;
    const bType = data?.type;
    const privateDeleteBlock = () => {
      if (
        !data.global &&
        isGlobalElem(getBlockElementById.current(data?.id))
      ) {
        data.global = true;
      }
      deleteBlock(data);
    };
    const handleCreateNewBlock = (
      newBType: TCromwellBlockType,
    ) =>
      createNewBlock(
        newBType,
        data,
        bType === "container" ? data : undefined,
      );

    // console.log("PLUGINS", plugins)

    const blockProps: TBlockMenuProps = {
      block: block,
      getBlockElementById: getBlockElementById.current,
      isGlobalElem: isGlobalElem,
      modifyData: (blockData: TCromwellBlockData) => {
        checkBlockDataGlobal(blockData);
        modifyBlock(blockData);
        block?.rerender();
        if (blockData?.parentId) {
          const parentBlock = getBlockById.current(
            blockData?.parentId,
          );
          parentBlock?.rerender();
        }
      },
      deleteBlock: privateDeleteBlock,
      addNewBlockAfter: handleCreateNewBlock,
      plugins: plugins,
      setCanDrag: (canDrag: boolean) => {
        if (!blockInfos[bId]) blockInfos[bId] = {};
        blockInfos[bId].canDrag = canDrag;
        setBlockInfos(blockInfos);
      },
      setCanDeselect: (canDeselect: boolean) => {
        if (!blockInfos[bId]) blockInfos[bId] = {};
        blockInfos[bId].canDeselect = canDeselect;
        setBlockInfos(blockInfos);
      },
      updateFramesPosition: updateFramesPosition,
    };
    return blockProps;
  }

  function pageChangeStart() {
    if (pageFrameRef.current) {
      pageFrameRef.current.style.transitionDuration =
        "0.5s";
      pageFrameRef.current.style.opacity = "0";
    }
  }

  function pageChangeFinish() {
    if (pageFrameRef.current) {
      setTimeout(() => {
        pageFrameRef.current.style.opacity = "1";
      }, 100);
    }
  }

  async function onPageChange() {
    if (!pageFrameRef.current) return;
    deselectCurrentBlock();
    pageChangeStart();
    await sleep(0.3);
    contentWindowRef.current =
      pageFrameRef.current.contentWindow;
    // console.log(contentWindowRef.current.origin)
    editorWidgetWrapperRef.current =
      document.getElementById(
        "editorWidgetWrapper",
      ) as HTMLDivElement;
    editorWidgetWrapperCroppedRef.current =
      document.getElementById(
        "editorWidgetWrapperCropped",
      ) as HTMLDivElement;

    const waitForModules = async () => {
      if (
        !contentWindowRef.current.CromwellStore?.nodeModules
          ?.modules?.["@cromwell/core-frontend"] ||
        !contentWindowRef.current.CromwellStore
          ?.forceUpdatePage
      ) {
        await sleep(0.2);
        await waitForModules();
      }
    };

    await waitForModules();

    // console.log("MODULES DONE");

    contentWindowRef.current.document.body.style.userSelect =
      "none";
    contentStore.current =
      contentWindowRef.current.CromwellStore;

    // console.log(contentWindowRef.current, contentStore.current)
    contentFrontend.current =
      contentStore.current.nodeModules?.modules?.[
        "@cromwell/core-frontend"
      ];
    // if (contentFrontend.current) {
    getBlockElementById.current =
      contentFrontend.current.getBlockElementById;
    getBlockData.current =
      contentFrontend.current.getBlockData;
    getBlockById.current =
      contentFrontend.current.getBlockById;
    // }

    getStoreItem.current =
      contentStore.current.nodeModules?.modules?.[
        "@cromwell/core"
      ].getStoreItem;
    setStoreItem.current =
      contentStore.current.nodeModules?.modules?.[
        "@cromwell/core"
      ].setStoreItem;

    // const getBlockElementId_ = contentFrontend.current.getBlockElementById
    // const getBlockData_ = contentFrontend.current.getBlockData
    const getBlockById_ =
      contentFrontend.current.getBlockById;
    // const getStoreItem_ = contentStore.current.nodeModules?.modules?.['@cromwell/core'].getStoreItem
    // const setStoreItem_ = contentStore.current.nodeModules?.modules?.['@cromwell/core'].setStoreItem

    setDraggable(
      new Draggable({
        document: contentWindowRef.current.document,
        draggableSelector: `.${blockCssClass}`,
        containerSelector: `.${getBlockHtmlType(
          "container",
        )}`,
        rootElement:
          contentWindowRef.current.document.getElementById(
            "CB_root",
          ),
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
        dragPlacement: "underline",
        disableClickAwayDeselect: true,
      }),
    );

    const styles =
      contentWindowRef.current.document.createElement(
        "style",
      );
    styles.innerHTML = contentStyles;
    contentWindowRef.current.document.head.appendChild(
      styles,
    );

    const rootBlock = getBlockById_(pageRootContainerId);
    if (rootBlock)
      rootBlock.addDidUpdateListener("PageBuilder", () => {
        updateDraggable();
      });

    document.body.addEventListener("mouseup", onMouseUp);
    // checkHistoryButtons();
    updateDraggable();
    pageChangeFinish();
    // pageChangeFinish();
  }

  useEffect(() => {
    onPageChange();
  }, [pageFrameRef.current]);

  return {
    onPageChange,
    deselectBlock,
    createBlockProps,
    selectedBlock,
    undoModification,
    redoModification,
    selectedEditableBlock,
    updateFramesPosition,
  };
};

export const usePageBuilder = () => {
  return React.useContext(PageBuilderContext);
};

type ContextType = ReturnType<typeof usePageBuilderContext>;
const Empty = {} as ContextType;

const PageBuilderContext =
  React.createContext<ContextType>(Empty);

export const PageBuilderProvider = ({ children }) => {
  const value = usePageBuilderContext();

  return (
    <PageBuilderContext.Provider value={value}>
      {children}
    </PageBuilderContext.Provider>
  );
};
