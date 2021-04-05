import { throttle } from 'throttle-debounce';

export type TDraggableOptions = {
    /**
     * CSS selector of blocks that can be dragged
     */
    draggableSelector: string;

    /**
     * CSS selector where draggable blocks can be placed
     */
    containerSelector: string;

    /**
     * DOM element inside of which Draggable works. Used to insert draggable elements. 
     * Will use "body" tag by default if no elem specified.
     */
    editorWindowElem?: HTMLElement;

    onBlockInserted?: (container: HTMLElement, draggedBlock: HTMLElement, nextElement?: Element | null) => void;

    canInsertBlock?: (container: HTMLElement, draggedBlock: HTMLElement, nextElement?: Element | null) => boolean;

    onBlockSelected?: (draggedBlock: HTMLElement) => void;

    onBlockDeSelected?: (draggedBlock: HTMLElement) => void;

    canDeselectBlock?: (draggedBlock: HTMLElement) => boolean;

    canDragBlock?: (draggedBlock: HTMLElement) => boolean;

    ignoreDraggableClass?: string;

    /**
     * Disable actual DOM insert of elements into new positions? If true, will
     * be used in "preview" mode and it'll create only block's shadows at new positions and remove
     * them at mouseUp event, so no modification will be applied to the DOM at the end
     * of a drag action. 
     * Use it to prevent React errors, since React must manage its elements by itself.
     * In this case handle insertion manually via onBlockInserted prop.
     */
    disableInsert?: boolean;

    /**
     * Color of frames
     */
    primaryColor?: string;

    /** Create a new draggable frame or find inside a block */
    createFrame?: boolean;
}

export class Draggable {

    // Block on which drag started
    private draggingBlock: HTMLElement | null = null;

    // Copy of draggingBlock that attached to the mouse cursor
    private draggingCursor: HTMLElement | null = null;

    private hoveredBlock: HTMLElement | null = null;
    private hoveredFrame: HTMLElement | null = null;
    private selectedBlock: HTMLElement | null = null;
    private selectedFrame: HTMLElement | null = null;
    private draggingBlockShadow: HTMLElement | null = null;

    private draggableBlocks: (HTMLElement | null)[] = [];
    private draggableFrames: (HTMLElement | null)[] = [];

    private containers: (HTMLElement | null)[] | null = [];

    private bodyElem: HTMLBodyElement | null = null;

    private canDragBlock: boolean = false;

    private isDragging: boolean = false;

    private options: TDraggableOptions;

    private onMouseDownInfo: {
        clientY: number;
        clientX: number;
    } | null = null;

    private onDragStartInfo: {
        mousePosYinsideBlock: number;
        mousePosXinsideBlock: number;
    } | null = null;

    private lastInsertionData: {
        draggingBlock: HTMLElement;
        container: HTMLElement;
        afterElement: HTMLElement;
    } | null = null;

    public static draggableFrameClass: string = 'DraggableBlock__frame';
    public static draggableBlockClass: string = 'DraggableBlock';
    public static draggableFrameHoveredCSSclass: string = 'DraggableBlock__frame_hovered';
    public static draggableFrameSelectedCSSclass: string = 'DraggableBlock__frame_selected';
    public static draggingClass: string = 'DraggableBlock__dragging';
    public static cursorClass: string = 'DraggableBlock__cursor';

    private canInsertBlock?: TDraggableOptions['canInsertBlock'];
    private onBlockInserted?: TDraggableOptions['onBlockInserted'];


    constructor(options: TDraggableOptions) {
        // check for underlying blocks to move to
        const bodyElem = document.querySelector('body');

        if (bodyElem) {
            this.bodyElem = bodyElem;
            bodyElem.addEventListener('mousemove', this.onMouseMove);
            bodyElem.addEventListener('mouseup', this.onDragStop);
            bodyElem.addEventListener('click', this.onPageBodyClick);
        }

        this.options = options;

        this.setupDraggableBlocks(options);
    }

    public setupDraggableBlocks = (options: TDraggableOptions) => {
        this.options = options;
        const { draggableSelector, containerSelector, editorWindowElem } = options;

        this.canInsertBlock = options.canInsertBlock;
        this.onBlockInserted = options.onBlockInserted;

        this.draggableBlocks = Array.from(document.querySelectorAll(draggableSelector)) as HTMLElement[];
        this.containers = Array.from(document.querySelectorAll(containerSelector)) as HTMLElement[];
        this.draggableBlocks.forEach(b => {
            if (b) this.setupBlock(b);
        });
    }

    private setupBlock = (block: HTMLElement) => {
        if (!block || !this.options) return;

        const draggableFrame: HTMLElement = this.options?.createFrame ? document.createElement('div') : block.querySelector(`.${Draggable.draggableFrameClass}`);
        draggableFrame.classList.add(Draggable.draggableFrameClass);

        if (this.options?.createFrame) block.appendChild(draggableFrame);
        block.classList.add(Draggable.draggableBlockClass);

        this.draggableFrames.push(draggableFrame);

        draggableFrame.addEventListener('click', (e) => {
            this.onBlockClick(block, draggableFrame, e);
        })

        block.addEventListener('click', (e) => {
            this.onBlockClick(block, draggableFrame, e);
        })

        block.addEventListener('mousedown', (e) => {
            if (this.options.ignoreDraggableClass &&
                block.classList.contains(this.options.ignoreDraggableClass)) return;

            if (draggableFrame) this.onBlockMouseDown(e, block);
        });

        block.addEventListener('mouseover', (e) => {
            if (draggableFrame) this.onHoverStart(e, block, draggableFrame);
        });

        block.addEventListener('mouseleave', (e) => {
            if (draggableFrame) this.onHoverEnd(e, block, draggableFrame);
        });
    }

    private clearBlock = (block: HTMLElement) => {
        const frames = block.querySelectorAll(`.${Draggable.draggableFrameClass}`);
        frames.forEach(frame => frame.remove());
        block.classList.remove(Draggable.draggableBlockClass);
    }

    public updateBlocks = () => {
        if (!this.options) {
            console.error('No options provided. Call setupDraggableBlocks first');
            return;
        }
        const { draggableSelector, containerSelector } = this.options;
        const updatedBlocks = Array.from(document.querySelectorAll(draggableSelector)) as HTMLElement[];
        // Clear old blocks that weren't found now
        if (this.draggableBlocks) {
            this.draggableBlocks.forEach(block => {
                if (block && !updatedBlocks.includes(block)) {
                    this.clearBlock(block);
                }
            })
        }

        // Setup newly appeared blocks
        updatedBlocks.forEach(block => {
            if (this.draggableBlocks && !this.draggableBlocks.includes(block)) {
                this.setupBlock(block);
            }
        })

        this.draggableBlocks = updatedBlocks;

        this.containers = Array.from(document.querySelectorAll(containerSelector)) as HTMLElement[];
    }

    private onBlockMouseDown = (event: MouseEvent, block: HTMLElement) => {
        if ((event as any).hitBlock) return;
        (event as any).hitBlock = true;

        this.draggingBlock = block;

        this.onMouseDownInfo = {
            clientY: event.clientY,
            clientX: event.clientX,
        }

        setTimeout(() => {
            if (this.draggingBlock) {
                this.canDragBlock = true;
            }
        }, 100);
    }

    private onDragStart = (block: HTMLElement, event: MouseEvent) => {
        const rect = this.draggingBlock.getBoundingClientRect();

        this.deselectCurrentBlock();

        this.onDragStartInfo = {
            mousePosYinsideBlock: (this.onMouseDownInfo?.clientY ?? 0) - rect.top + 10,
            mousePosXinsideBlock: (this.onMouseDownInfo?.clientX ?? 0) - rect.left + 10
        }

        this.draggingCursor = block.cloneNode(true) as HTMLElement;
        this.draggingCursor.classList.add(Draggable.cursorClass);
        this.draggingCursor.style.height = this.draggingBlock.offsetHeight + 'px';
        this.draggingCursor.style.width = this.draggingBlock.offsetWidth + 'px';

        const { editorWindowElem } = this.options;
        if (editorWindowElem) {
            editorWindowElem.appendChild(this.draggingCursor);
        } else if (this.bodyElem) {
            this.bodyElem.appendChild(this.draggingCursor);
        }

        this.draggingBlock.classList.add(Draggable.draggingClass);

        if (this.options.disableInsert) {
            this.lastInsertionData = null;

            if (this.draggingBlockShadow) this.draggingBlockShadow.remove();
            this.draggingBlockShadow = this.draggingBlock.cloneNode(true) as HTMLElement;

            if (editorWindowElem) {
                editorWindowElem.appendChild(this.draggingBlockShadow);
            } else if (this.bodyElem) {
                this.bodyElem.appendChild(this.draggingBlockShadow);
            }
        }
    }


    private onMouseMove = (event: MouseEvent) => {
        // console.log('canDragBlock', canDragBlock, 'draggingBlock', draggingBlock);
        if (this.canDragBlock && this.draggingBlock) {
            if (!this.isDragging) {

                let canDrag = true;
                if (this.options.canDragBlock) {
                    canDrag = this.options.canDragBlock(this.draggingBlock)
                }

                if (canDrag !== false) {
                    this.isDragging = true;
                    this.onDragStart(this.draggingBlock, event);
                }
            }

            if (this.draggingCursor) {
                const mousePosYinsideBlock = this.onDragStartInfo?.mousePosYinsideBlock ?? 0;
                const mousePosXinsideBlock = this.onDragStartInfo?.mousePosXinsideBlock ?? 0;

                this.draggingCursor.style.top = (event.clientY - mousePosYinsideBlock) + 'px';
                this.draggingCursor.style.left = (event.clientX - mousePosXinsideBlock) + 'px';

                this.tryToInsert(event);
            }
        }
    }

    private tryToInsert = throttle(100, (event: MouseEvent) => {
        if (this.hoveredBlock && this.draggingBlock) {

            if (this.draggingBlock.contains(this.hoveredBlock)) return;

            const afterElement = this.getDragAfterElement(this.hoveredBlock, event.clientY);

            const canInsert = this.canInsertBlock ?
                this.canInsertBlock(this.hoveredBlock, this.draggingBlock, afterElement) : true;

            if (canInsert) {
                let blockToInsert: HTMLElement | null = null;

                if (this.options.disableInsert) {
                    blockToInsert = this.draggingBlockShadow;

                    this.draggingBlock.style.display = 'none';
                    this.draggingBlockShadow.style.display = '';
                    this.lastInsertionData = {
                        draggingBlock: this.draggingBlock,
                        container: this.hoveredBlock,
                        afterElement: afterElement as HTMLElement
                    }
                } else {
                    blockToInsert = this.draggingBlock;
                }

                try {
                    if (afterElement) {
                        this.hoveredBlock.insertBefore(blockToInsert, afterElement)
                    } else {
                        this.hoveredBlock.appendChild(blockToInsert);
                    }

                    if (!this.options.disableInsert)
                        this.onBlockInserted?.(this.hoveredBlock, this.draggingBlock, afterElement);
                } catch (e) {
                    console.error(e);
                }

            }
        }
    });

    private getDragAfterElement(container: HTMLElement, clientY: number): Element | null {
        const draggableElements = Array.from(container.children).filter(child =>
            child.classList.contains(Draggable.draggableBlockClass) &&
            !child.classList.contains(Draggable.draggingClass))

        let closestElement: Element | null = null;
        let closestOffset: number = Number.NEGATIVE_INFINITY;

        draggableElements.forEach(element => {
            const box = element.getBoundingClientRect();
            const offset = clientY - box.top - box.height / 2;
            if (offset < 0 && offset > closestOffset) {
                closestElement = element;
                closestOffset = offset;
            }
        });

        return closestElement;
    }

    private onDragStop = () => {
        this.canDragBlock = false;
        this.isDragging = false;

        if (this.draggingBlock) {
            this.draggingBlock.classList.remove(Draggable.draggingClass);
        }

        if (this.options.disableInsert) {
            if (this.draggingBlockShadow) this.draggingBlockShadow.remove();
            if (this.draggingBlock) this.draggingBlock.style.display = '';

            if (this.lastInsertionData)
                this.onBlockInserted?.(this.lastInsertionData.container,
                    this.lastInsertionData.draggingBlock, this.lastInsertionData.afterElement);

            this.draggingBlockShadow = null;
            this.lastInsertionData = null;
        }

        this.draggingBlock = null;

        if (this.draggingCursor) {
            this.draggingCursor.remove();
            this.draggingCursor = null;
        }
    }

    private onHoverStart = (event: MouseEvent, block: HTMLElement, frame: HTMLElement) => {
        if ((event as any).hitContainer) return;
        if (this.containers.includes(block)) {
            (event as any).hitContainer = true;
        }

        // When dragging, we want to highlight only containers
        // But when we do not, highlight draggable blocks
        if (this.isDragging && !this.containers.includes(block)) return;

        if ((event as any).hitBlock) return;
        (event as any).hitBlock = true;

        if (this.hoveredBlock === block) return;

        if (this.hoveredBlock && this.hoveredBlock !== this.selectedBlock) {
            this.blockHoverEnd(event, this.hoveredBlock, this.hoveredFrame);
        }

        this.hoveredBlock = block;
        this.hoveredFrame = frame;

        if (block !== this.selectedBlock) {
            this.styleHoveredBlock(block, frame);
        }
    }

    private onHoverEnd = (event: MouseEvent, block: HTMLElement, frame?: HTMLElement) => {
        if ((event as any).hitBlock) return;
        (event as any).hitBlock = true;

        this.blockHoverEnd(event, block, frame);
    }

    private blockHoverEnd = (event: MouseEvent, block: HTMLElement, frame?: HTMLElement) => {
        if (block !== this.selectedBlock && frame) {
            this.styleDeselectedBlock(block, frame);
        }
        this.hoveredBlock = null;
        this.hoveredFrame = null;
    }

    private onBlockClick = (block: HTMLElement, frame: HTMLElement, event: MouseEvent) => {
        if ((event as any).hitBlock) return;
        (event as any).hitBlock = true;

        if (block !== this.selectedBlock) {
            const canDeselectBlock = this.deselectCurrentBlock();
            if (!canDeselectBlock) return;

            this.options?.onBlockSelected?.(block);
            this.selectedBlock = block;
            this.selectedFrame = frame;
            this.styleSelectedBlock(block, frame);
        }
    }

    private onPageBodyClick = (event: MouseEvent) => {
        if ((event as any).hitBlock) return;
        this.deselectCurrentBlock();
    }

    private deselectCurrentBlock = (): boolean => {
        if (this.options.canDeselectBlock) {
            const canDeselectBlock = this.options.canDeselectBlock(this.selectedBlock);
            if (canDeselectBlock === false) return false;
        }

        if (this.selectedBlock) {
            this.styleDeselectedBlock(this.selectedBlock, this.selectedFrame)
            this.options?.onBlockDeSelected?.(this.selectedBlock);
        }
        if (this.selectedBlock === this.hoveredBlock) {
            this.styleHoveredBlock(this.selectedBlock, this.selectedFrame);
        }
        this.selectedBlock = null;
        this.selectedFrame = null;
        return true;
    }

    private styleHoveredBlock = (block: HTMLElement, frame: HTMLElement) => {
        if (block) block.style.zIndex = '5';

        if (frame) {
            const color = this.options?.primaryColor ?? '#9900CC';
            frame.classList.add(Draggable.draggableFrameHoveredCSSclass);
            frame.style.border = `1px solid ${color}`;
        }
    }

    private styleSelectedBlock = (block: HTMLElement, frame: HTMLElement) => {
        block.style.zIndex = '6';

        const color = this.options?.primaryColor ?? '#9900CC';
        frame.classList.add(Draggable.draggableFrameHoveredCSSclass);
        frame.style.border = `2px solid ${color}`;
    }

    private styleDeselectedBlock = (block: HTMLElement, frame?: HTMLElement) => {
        if (block) block.style.zIndex = '2';

        if (frame) {
            frame.classList.remove(Draggable.draggableFrameHoveredCSSclass);
            frame.style.border = '0';
        }
    }


}