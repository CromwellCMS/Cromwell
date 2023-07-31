import { TCromwellBlockData } from '@cromwell/core';
import { Draggable } from '../../../helpers/Draggable/Draggable';

export const useBlockEvents = ({
  draggable,
  contentWindowRef,
  selectedBlock,
  selectedFrames,
  updateDraggable,
  getBlockIdFromHtml,
  getBlockById,
  findEditableParent,
  selectedEditableBlock,
  invisibleSelectedFrames,
  createBlockFrame,
  getFrameColor,
  editorWidgetWrapperCroppedRef,
  editorWidgetWrapperRef,
  getBlockElementById,
  blockInfos,
  getBlockData,
  checkBlockDataGlobal,
  modifyBlock,
  isGlobalElem,
  rerenderBlocks,
  rerender,
}) => {
  const onMouseUp = () => {
    draggable.current.onMouseUp();
  };

  const onTryToInsert = (container: HTMLElement, draggedBlock: HTMLElement, shadow?: HTMLElement) => {
    if (!shadow) return;

    shadow.style.zIndex = '100000';
    shadow.style.position = 'relative';

    const shadowFrame = contentWindowRef.current.document.createElement('div');
    shadowFrame.style.border = `2px solid #2AB7CA`;
    shadowFrame.style.zIndex = '10000';
    shadowFrame.style.position = 'absolute';
    shadowFrame.style.top = '0';
    shadowFrame.style.bottom = '0';
    shadowFrame.style.right = '0';
    shadowFrame.style.left = '0';

    shadow.appendChild(shadowFrame);
  };

  const onBlockDeSelected = (block: HTMLElement) => {
    if (!block) return;
    selectedBlock.current = null;
    // blockMenu.current.setSelectedBlock(null, null, null);
    // pageBuilderSidebar.setSelectedBlock(null, null);
    selectedFrames.current[block.id]?.remove();
    delete selectedFrames.current[block.id];
    // setSelectedFrames(selectedFrames);

    updateDraggable();
  };

  const onBlockSelected = (block: HTMLElement) => {
    if (!block) return;
    if (selectedFrames.current[block.id]) return;
    let crwBlock = getBlockById.current(getBlockIdFromHtml(block.id));
    const blockData = crwBlock?.getData();

    if (blockData.editorHidden) {
      const editable = findEditableParent(block);
      if (!editable) return;

      block = editable;
      crwBlock = getBlockById.current(getBlockIdFromHtml(editable.id));
    }

    selectedEditableBlock.current = crwBlock;

    if (selectedBlock.current) {
      selectedBlock.current.style.cursor = 'initial';
      onBlockDeSelected(selectedBlock.current);
    }
    selectedBlock.current = block;
    selectedBlock.current.style.cursor = 'move';

    Object.values(selectedFrames.current).forEach((frame: any) => frame?.remove());
    Object.values(invisibleSelectedFrames.current).forEach((frame: any) => frame?.remove());
    // setSelectedFrames({});
    // setInvisibleSelectedFrames({});
    selectedFrames.current = {};
    invisibleSelectedFrames.current = {};

    const frame = createBlockFrame(block);
    frame.style.border = `2px solid ${getFrameColor(block)}`;

    selectedFrames.current[block.id] = frame;
    editorWidgetWrapperCroppedRef.current.appendChild(frame);

    const invisibleFrame = frame.cloneNode(true) as HTMLDivElement;
    invisibleFrame.style.border = null;
    invisibleSelectedFrames.current[block.id] = invisibleFrame;
    editorWidgetWrapperRef.current.appendChild(invisibleFrame);

    updateDraggable();
    rerender();
  };

  const deselectBlock = (block: HTMLElement) => {
    draggable.current?.deselectCurrentBlock();
    onBlockDeSelected(block);
  };

  const deselectCurrentBlock = () => {
    if (selectedBlock.current) {
      deselectBlock(selectedBlock.current);
    }
  };

  const selectBlock = (blockData: TCromwellBlockData) => {
    draggable.current?.deselectCurrentBlock();
    onBlockSelected(getBlockElementById.current(blockData.id));
  };

  const canDeselectBlock = (draggedBlock: HTMLElement) => {
    const blockData = Object.assign({}, getBlockData.current(draggedBlock));
    if (blockData?.id) {
      return blockInfos[blockData?.id]?.canDeselect ?? true;
    }
    return true;
  };

  const canDragBlock = (draggedBlock: HTMLElement) => {
    const blockData = Object.assign({}, getBlockData.current(draggedBlock));
    if (blockData?.id) {
      return (blockInfos[blockData?.id]?.canDrag ?? true) as boolean;
    }
    return true;
  };

  const addBlock = (config: {
    blockData: TCromwellBlockData;
    targetBlockData?: TCromwellBlockData;
    parentData?: TCromwellBlockData;
    position: 'before' | 'after';
  }): TCromwellBlockData[] => {
    const { targetBlockData, position } = config;
    const blockData = Object.assign({}, config.blockData);

    const parentData =
      getBlockData.current(getBlockElementById.current(targetBlockData?.id)?.parentNode) ?? config?.parentData;
    const parent = getBlockElementById.current(parentData.id);
    if (!parentData || !parent) {
      console.warn('Failed to add new block, parent was not found: ', parentData, parent, ' block data: ', blockData);
      return;
    }

    const childrenData: TCromwellBlockData[] = [];

    let iteration = 0;
    let newBlockIndex = -1;

    // Sort parent's children
    Array.from(parent.children).forEach((child: HTMLElement) => {
      const childData = Object.assign({}, getBlockData.current(child));
      if (!childData.id) return;
      if (child.classList.contains(Draggable.cursorClass)) return;
      if (childData.id === blockData.id) return;

      if (childData.id === targetBlockData?.id && position === 'before') {
        newBlockIndex = iteration;
        iteration++;
        childrenData.push(blockData);
      }

      childData.index = iteration;
      iteration++;

      childData.parentId = parentData.id;
      childrenData.push(childData);

      if (childData.id === targetBlockData?.id && position === 'after') {
        newBlockIndex = iteration;
        iteration++;
        childrenData.push(blockData);
      }

      checkBlockDataGlobal(childData);
      modifyBlock(childData, false);
    });

    if (newBlockIndex === -1) {
      newBlockIndex = iteration;
      childrenData.push(blockData);
    }

    blockData.parentId = parentData.id;
    blockData.index = newBlockIndex;
    blockData.global = isGlobalElem(parent);

    modifyBlock(blockData);

    return childrenData;
  };

  const onBlockInserted = async (
    container: HTMLElement,
    draggedBlock: HTMLElement,
    nextElement?: HTMLElement | null,
  ) => {
    const blockData = Object.assign({}, getBlockData.current(draggedBlock));
    const newParentData = Object.assign({}, getBlockData.current(container));
    const nextData = getBlockData.current(nextElement);

    if (!blockData?.id) {
      console.error('!blockData.id: ', draggedBlock);
      return;
    }
    if (!newParentData?.id) {
      console.error('!parentData.id: ', draggedBlock);
      return;
    }

    addBlock({
      blockData,
      targetBlockData: nextData,
      parentData: getBlockData.current(container),
      position: 'before',
    });

    await rerenderBlocks();

    draggable.current?.updateBlocks();

    setTimeout(() => {
      getBlockElementById.current(blockData.id)?.click();
      selectBlock(blockData);
    }, 100);
  };

  return {
    canDragBlock,
    canDeselectBlock,
    selectBlock,
    deselectBlock,
    deselectCurrentBlock,
    onBlockDeSelected,
    onBlockSelected,
    onBlockInserted,
    onMouseUp,
    onTryToInsert,
    addBlock,
  };
};
