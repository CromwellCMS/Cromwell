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
    rootElement?: HTMLElement;
    rootElementSelector?: string;


    /**
     * How to display element at the new place during dragging. Create a preview element
     * cloning dragging one (will have impact on a layout which may lead to twitching) 
     * or just show an underline at the new place.
     */
    dragPlacement?: 'element' | 'underline';

    onBlockInserted?: (container: HTMLElement, draggedBlock: HTMLElement, nextElement?: Element | null) => void;
    onTryToInsert?: (container: HTMLElement, draggedBlock: HTMLElement, shadow?: HTMLElement | null, nextElement?: Element | null) => void;
    canInsertBlock?: (container: HTMLElement, draggedBlock: HTMLElement, nextElement?: Element | null) => boolean;

    onBlockSelected?: (draggedBlock: HTMLElement) => void;
    onBlockDeSelected?: (draggedBlock: HTMLElement) => void;

    onBlockHoverStart?: (draggedBlock: HTMLElement) => void;
    onBlockHoverEnd?: (draggedBlock: HTMLElement) => void;

    canDeselectBlock?: (draggedBlock: HTMLElement) => boolean;

    canDragBlock?: (draggedBlock: HTMLElement) => boolean;

    getFrameColor?: (block: HTMLElement) => string;

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
    draggableFrameClass?: string;

    /** Custom document to work on (e.g. in iframe) */
    document?: typeof document;

    iframeSelector?: string;

    disableClickAwayDeselect?: boolean;
    applyZIndex?: boolean;
}

export class Draggable {

    // Block on which drag started
    private draggingBlock: HTMLElement | null = null;
    // Copy of draggingBlock that attached to the mouse cursor
    private draggingCursor: HTMLElement | null = null;
    private hoveredBlock: HTMLElement | null = null;
    private selectedBlock: HTMLElement | null = null;
    private draggingBlockShadow: HTMLElement | null = null;
    private draggableBlocks: (HTMLElement | null)[] = [];
    private containers: (HTMLElement | null)[] | null = [];
    private canDragBlock = false;
    private isDragging = false;
    private options: TDraggableOptions;
    private document = document;

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
        this.setupDraggableBlocks(options);
    }

    public setupDraggableBlocks = (options: TDraggableOptions) => {
        const { draggableSelector, containerSelector } = options;
        this.setOptions(options);

        this.draggableBlocks = Array.from(this.document.querySelectorAll(draggableSelector)) as HTMLElement[];
        this.containers = Array.from(this.document.querySelectorAll(containerSelector)) as HTMLElement[];
        this.draggableBlocks.forEach(b => {
            if (b) this.setupBlock(b);
        });
    }

    public setOptions(options: TDraggableOptions) {
        this.options = options;
        if (!this.options.dragPlacement) this.options.dragPlacement = 'element';
        this.canInsertBlock = options.canInsertBlock;
        this.onBlockInserted = options.onBlockInserted;
        if (options.document) this.document = options.document;

        this.document.body.addEventListener('mousemove', this.onMouseMove);
        this.document.body.addEventListener('mouseup', this.onDragStop);
        this.document.body.addEventListener('click', this.onPageBodyClick);

        if (options.iframeSelector) {
            const iframe: HTMLIFrameElement = document.querySelector(options.iframeSelector)
            if (iframe) {
                this.document = iframe.contentDocument;
            }
        }

        if (!options.rootElement && options.rootElementSelector) {
            options.rootElement = document.querySelector(options.rootElementSelector);
        }
    }

    private setupBlock = (block: HTMLElement) => {
        if (!block || !this.options) return;

        block.classList.add(Draggable.draggableBlockClass);


        block.addEventListener('click', (e) => {
            this.onBlockClick(block, e);
        });

        block.addEventListener('mousedown', (e) => {
            if (this.options.ignoreDraggableClass &&
                block.classList.contains(this.options.ignoreDraggableClass)) return;

            this.onBlockMouseDown(e, block);
        });

        block.addEventListener('mouseover', (e) => {
            this.onHoverStart(e, block);
        });

        block.addEventListener('mouseleave', (e) => {
            this.onHoverEnd(e, block);
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
        const updatedBlocks = Array.from(this.document.querySelectorAll(draggableSelector)) as HTMLElement[];
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

        this.containers = Array.from(this.document.querySelectorAll(containerSelector)) as HTMLElement[];
    }

    public onMouseUp = () => {
        this.onDragStop();
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

    private onDragStart = (block: HTMLElement) => {
        const rect = this.draggingBlock.getBoundingClientRect();

        // this.deselectCurrentBlock();

        this.onDragStartInfo = {
            mousePosYinsideBlock: (this.onMouseDownInfo?.clientY ?? 0) - rect.top + 10,
            mousePosXinsideBlock: (this.onMouseDownInfo?.clientX ?? 0) - rect.left + 10
        }

        this.draggingCursor = block.cloneNode(true) as HTMLElement;
        this.draggingCursor.classList.add(Draggable.cursorClass);
        this.draggingCursor.style.height = this.draggingBlock.offsetHeight + 'px';
        this.draggingCursor.style.width = this.draggingBlock.offsetWidth + 'px';

        const { rootElement } = this.options;
        if (rootElement) {
            rootElement.appendChild(this.draggingCursor);
        } else {
            this.document.body.appendChild(this.draggingCursor);
        }

        this.draggingBlock.classList.add(Draggable.draggingClass);

        if (this.options.disableInsert) {
            this.lastInsertionData = null;

            if (this.draggingBlockShadow) this.draggingBlockShadow.remove();

            if (this.options.dragPlacement === 'element') {
                this.draggingBlockShadow = this.draggingBlock.cloneNode(true) as HTMLElement;
                this.draggingBlockShadow.style.display = 'none';
            } else {
                // underline
                this.draggingBlockShadow = document.createElement('div');
                this.draggingBlockShadow.classList.add('DraggableBlock__underline_container');
                const underline = document.createElement('div');
                underline.classList.add('DraggableBlock__underline');
                underline.style.width = this.draggingBlock.clientWidth + 'px';
                this.draggingBlockShadow.appendChild(underline);
            }

            if (rootElement) {
                rootElement.appendChild(this.draggingBlockShadow);
            } else {
                this.document.body.appendChild(this.draggingBlockShadow);
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
                    this.onDragStart(this.draggingBlock);
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
        if (!this.hoveredBlock || !this.draggingBlock) return;
        if (this.draggingBlock.contains(this.hoveredBlock)) return;

        const afterElement = this.getDragAfterElement(this.hoveredBlock, event.clientY);

        const canInsert = this.canInsertBlock ?
            this.canInsertBlock(this.hoveredBlock, this.draggingBlock, afterElement) : true;

        if (canInsert) {
            let blockToInsert: HTMLElement | null = null;

            if (this.options.disableInsert) {
                blockToInsert = this.draggingBlockShadow;

                if (this.options.dragPlacement === 'element') {
                    this.draggingBlock.style.display = 'none';
                }

                if (this.draggingBlockShadow) this.draggingBlockShadow.style.display = '';
                this.lastInsertionData = {
                    draggingBlock: this.draggingBlock,
                    container: this.hoveredBlock,
                    afterElement: afterElement as HTMLElement
                }
            } else {
                blockToInsert = this.draggingBlock;
            }

            try {
                if (blockToInsert) {
                    if (afterElement) {
                        this.hoveredBlock.insertBefore(blockToInsert, afterElement)
                    } else {
                        this.hoveredBlock.appendChild(blockToInsert);
                    }
                }

                this.options?.onTryToInsert(this.hoveredBlock, this.draggingBlock, blockToInsert, afterElement)


                if (!this.options.disableInsert)
                    this.onBlockInserted?.(this.hoveredBlock, this.draggingBlock, afterElement);
            } catch (e) {
                console.error(e);
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

    private onHoverStart = (event: MouseEvent, block: HTMLElement) => {
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
            this.blockHoverEnd(event, this.hoveredBlock);
        }

        this.hoveredBlock = block;
        this.options?.onBlockHoverStart?.(block);

        if (block !== this.selectedBlock) {
            this.styleHoveredBlock(block);
        }
    }

    private onHoverEnd = (event: MouseEvent, block: HTMLElement) => {
        if ((event as any).hitBlock) return;
        (event as any).hitBlock = true;

        this.blockHoverEnd(event, block);
    }

    private blockHoverEnd = (event: MouseEvent, block: HTMLElement) => {
        if (block !== this.selectedBlock) {
            this.styleDeselectedBlock(block);
        }
        this.options?.onBlockHoverEnd?.(this.hoveredBlock);
        this.hoveredBlock = null;
    }

    private onBlockClick = (block: HTMLElement, event: MouseEvent) => {
        if ((event as any).hitBlock) return;
        (event as any).hitBlock = true;

        if (block !== this.selectedBlock) {
            const canDeselectBlock = this.deselectCurrentBlock();
            if (!canDeselectBlock) return;

            this.options?.onBlockSelected?.(block);
            this.selectedBlock = block;
            this.styleSelectedBlock(block);
        }
    }

    private onPageBodyClick = (event: MouseEvent) => {
        if ((event as any).hitBlock) return;
        if (!this.options.disableClickAwayDeselect)
            this.deselectCurrentBlock();
    }

    public deselectCurrentBlock = (): boolean => {
        if (this.options.canDeselectBlock) {
            const canDeselectBlock = this.options.canDeselectBlock(this.selectedBlock);
            if (canDeselectBlock === false) return false;
        }

        if (this.selectedBlock) {
            this.styleDeselectedBlock(this.selectedBlock)
            this.options?.onBlockDeSelected?.(this.selectedBlock);
        }
        if (this.selectedBlock === this.hoveredBlock) {
            this.styleHoveredBlock(this.selectedBlock);
        }
        this.selectedBlock = null;
        return true;
    }

    private styleHoveredBlock = (block: HTMLElement) => {
        if (block) {
            if (this.options.applyZIndex) block.style.zIndex = '1005';

            const styleParent = (block: HTMLElement) => {
                const parent = block.parentElement;
                if (parent) {
                    if (parent === this.options.rootElement) return;
                    if (this.draggableBlocks.includes(parent)) parent.style.zIndex = '1005';
                    styleParent(parent);
                }
            }
            styleParent(block);
        }
    }

    private styleSelectedBlock = (block: HTMLElement) => {
        if (block) {
            if (this.options.applyZIndex) block.style.zIndex = '1006';

            const styleParent = (block: HTMLElement) => {
                const parent = block.parentElement;
                if (parent) {
                    if (parent === this.options.rootElement) return;
                    if (this.draggableBlocks.includes(parent)) parent.style.zIndex = '1006';
                    styleParent(parent);
                }
            }
            styleParent(block);
        }
    }

    private styleDeselectedBlock = (block: HTMLElement) => {
        if (this.options.applyZIndex) if (block) block.style.zIndex = '1002';
    }
}