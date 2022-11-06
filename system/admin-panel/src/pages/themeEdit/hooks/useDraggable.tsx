import React, { useCallback, useRef, useState } from 'react';
import { throttle } from 'throttle-debounce';
import { TDraggableOptions } from '../../../helpers/Draggable/Draggable';

const draggableFrameClass: string = 'DraggableBlock__frame';
const draggableBlockClass: string = 'DraggableBlock';
const draggableFrameHoveredCSSclass: string = 'DraggableBlock__frame_hovered';
const draggableFrameSelectedCSSclass: string = 'DraggableBlock__frame_selected';
const draggingClass: string = 'DraggableBlock__dragging';
const cursorClass: string = 'DraggableBlock__cursor';

export const useDraggable = () => {
  const draggingBlock = useRef<HTMLElement | null>();
  // Copy of draggingBlock that attached to the mouse cursor
  const draggingCursor = useRef<HTMLElement | null>();
  const hoveredBlock = useRef<HTMLElement | null>();
  const selectedBlock = useRef<HTMLElement | null>();
  const draggingBlockShadow = useRef<HTMLElement | null>();
  const draggableBlocks = useRef<(HTMLElement | null)[]>([]);
  const containers = useRef<(HTMLElement | null)[]>([]);
  const [canDragBlock, setCanDragBlock] = useState(false);
  const [isDragging, setDragging] = useState(false);
  const [options, setOptions] = useState<TDraggableOptions>();

  const [onMouseDownInfo, setOnMouseDownInfo] = useState<{
    clientY: number;
    clientX: number;
  } | null>();

  const [onDragStartInfo, setDragStartInfo] = useState<{
    mousePosYinsideBlock: number;
    mousePosXinsideBlock: number;
  } | null>();

  const [lastInsertionData, setLastInsertionData] = useState<{
    draggingBlock: HTMLElement;
    container: HTMLElement;
    afterElement: HTMLElement;
  } | null>();

  const setupBlock = useCallback((block: HTMLElement) => {}, []);

  const setupDraggableBlocks = useCallback((opts: TDraggableOptions) => {
    setOptions(opts);

    draggableBlocks.current = Array.from(document.querySelectorAll(opts.draggableSelector)) as HTMLElement[];

    containers.current = Array.from(document.querySelectorAll(opts.containerSelector)) as HTMLElement[];

    draggableBlocks.current.forEach((b) => {
      if (b) setupBlock(b);
    });
  }, []);
};
