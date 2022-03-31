import { useRef, useState } from "react";
import { Draggable } from "../../../helpers/Draggable/Draggable";

export const useEditorFrames = ({
  getBlockById,
  getBlockElementById,
  getBlockIdFromHtml,
  getFrameColor,
  editorWidgetWrapperCroppedRef,
  contentWindowRef,
  selectableFrameMargin,
  pageFrameRef,
}) => {
  const hoveredFrames = useRef<Record<string, HTMLElement>>(
    {},
  );
  const selectedFrames = useRef<
    Record<string, HTMLElement>
  >({});
  const invisibleSelectedFrames = useRef<
    Record<string, HTMLElement>
  >({});
  const [draggable, setDraggable] = useState<Draggable>();

  const createBlockFrame = (block: HTMLElement) => {
    const selectableFrame =
      contentWindowRef.current.document.createElement(
        "div",
      );
    selectableFrame.style.zIndex = "10";
    selectableFrame.style.pointerEvents = "none";

    selectableFrame.style.border = `1px solid ${getFrameColor(
      block,
    )}`;
    setFramePosition(block, selectableFrame);
    return selectableFrame;
  };

  const onBlockHoverStart = (block: HTMLElement) => {
    if (!block) return;
    if (hoveredFrames.current[block.id]) return;
    const crwBlock = getBlockById.current(
      getBlockIdFromHtml(block.id),
    );
    const blockData = crwBlock?.getData();
    if (blockData.editorHidden) return;

    const frame = createBlockFrame(block);
    frame.style.border = `1px solid ${getFrameColor(
      block,
    )}`;
    frame.style.boxShadow = `0px 0px 5px 1px ${getFrameColor(
      block,
    )}`;
    frame.style.userSelect = "none";
    frame.setAttribute("draggable", "false");

    editorWidgetWrapperCroppedRef.current.appendChild(
      frame,
    );
    hoveredFrames.current[block.id] = frame;
    // setHoveredFrames(hoveredFrames);
  };

  const onBlockHoverEnd = (block: HTMLElement) => {
    if (!block) return;
    hoveredFrames.current[block.id]?.remove();
    delete hoveredFrames.current[block.id];
    // setHoveredFrames(hoveredFrames);
  };

  const setFramePosition = (
    block: HTMLElement,
    frame: HTMLElement,
  ) => {
    const bounding = block.getBoundingClientRect();
    frame.style.position = "absolute";
    frame.style.top =
      bounding.top + selectableFrameMargin + "px";
    frame.style.left =
      bounding.left + selectableFrameMargin + "px";

    frame.style.height = block.offsetHeight + "px";
    frame.style.width = block.offsetWidth + "px";
  };

  const updateFramesPosition = () => {
    // console.log(selectedFrames, invisibleSelectedFrames,);
    [
      ...Object.entries(selectedFrames.current),
      ...Object.entries(invisibleSelectedFrames.current),
      ...Object.entries(hoveredFrames.current),
    ].forEach((entry) => {
      const block = getBlockElementById.current(
        getBlockIdFromHtml(entry[0]),
      );
      if (!entry[1]) return;
      if (!block) {
        entry[1].remove();
        return;
      }
      setFramePosition(block, entry[1]);
    });
  };

  const onAnyElementScroll = () => {
    updateFramesPosition();
  };

  return {
    onBlockHoverStart,
    onBlockHoverEnd,
    hoveredFrames,
    selectedFrames,
    invisibleSelectedFrames,
    setFramePosition,
    createBlockFrame,
    updateFramesPosition,
    onAnyElementScroll,
    draggable,
    setDraggable,
  };
};
