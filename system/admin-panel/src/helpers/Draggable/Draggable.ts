import { debounce } from "debounce";

type TDraggableOptions = {
    /**
     * CSS selector of blocks that can be dragged
     */
    draggableBlocksSelector: string;

    /**
     * DOM element inside of which Draggable works. Used to insert draggable elements. 
     * Will use "body" tag by default if no elem specified.
     */
    editorWindowElem?: HTMLElement;

    onBlockInserted?: (draggedBlock: HTMLElement, targetBlock: HTMLElement,
        position: 'before' | 'after' | 'inside') => void;

    canInsertBlock?: (draggedBlock: HTMLElement, targetBlock: HTMLElement,
        position: 'before' | 'after' | 'inside') => boolean;

    onBlockSelected?: (draggedBlock: HTMLElement) => void;


    /**
     * Should actually insert original elements into targets? If false, will
     * be used in "preview" mode and it'll create only block's shadows and remove
     * them at mouseUp event, so no modification will be applied to the DOM at the end
     * of a drag action.
     * Useful with onBlockInserted prop to handle insertion manually.
     * True by default
     */
    hasToMoveElements?: boolean;

    /**
     * Color of frames
     */
    primaryColor?: string;

    // draggableFrameSelector: string,
    // draggableFrameHoveredCSSclass?: string,
    // draggableFrameSelectedCSSclass?: string
}

export class Draggable {

    private draggingBlock: HTMLElement | null = null;
    private draggingBlockId: string | null = null;
    private draggableBlocks: (HTMLElement | null)[] | null = null;
    private draggableFrames: HTMLElement[] = [];
    private isDragging = false;
    private draggingBlockHeight = 0;
    private draggingBlockWidth = 0;

    private lastTargetBlock: HTMLElement | null = null;
    private lastPosition: 'before' | 'after' | 'inside' | null = null;
    private lastOptions: TDraggableOptions | null = null;

    private onMouseDownInfo: {
        clientY: number;
        clientX: number;
    } | null = null;

    private onDragStartInfo: {
        mousePosYinsideBlock: number;
        mousePosXinsideBlock: number;
    } | null = null;

    /**
     * Movable shadow of a block. Gets inserted into the DOM when user starts drag a block
     */
    private _draggingBlockMoveableCopy: HTMLElement | null = null;
    private set draggingBlockMoveableCopy(val) {
        if (this._draggingBlockMoveableCopy) this._draggingBlockMoveableCopy.remove();
        this._draggingBlockMoveableCopy = val;
    }
    private get draggingBlockMoveableCopy() {
        return this._draggingBlockMoveableCopy;
    }

    /**
     * Immovabe shadow of a block. Gets inserted into the DOM when user hover other blocks
     */
    private _draggingBlockShadowCopy: HTMLElement | null = null;
    private set draggingBlockShadowCopy(val) {
        if (this._draggingBlockShadowCopy) this._draggingBlockShadowCopy.remove();
        this._draggingBlockShadowCopy = val;
    }
    private get draggingBlockShadowCopy() {
        return this._draggingBlockShadowCopy;
    }

    private hoveredBlock: HTMLElement | null = null;
    private hoveredBlockId: string | null = null;
    private canDragBlock: boolean = false;


    private draggableFrameClass: string = 'DraggableBlock__frame';
    private draggableBlockClass: string = 'DraggableBlock';
    public draggableShadowClass: string = 'DraggableBlock__shadow';

    private draggableFrameHoveredCSSclass: string = 'DraggableBlock__frame_hovered';
    private draggableFrameSelectedCSSclass: string = 'DraggableBlock__frame_selected';

    private canInsertBlock?: TDraggableOptions['canInsertBlock'];
    private onBlockInserted?: TDraggableOptions['onBlockInserted'];
    private hasToMoveElements: boolean = true;

    constructor(options: TDraggableOptions) {
        // check for underlying blocks to move to
        const bodyElem = document.querySelector('body');

        if (bodyElem) {
            bodyElem.onmousemove = this.onMouseMove;
            bodyElem.onmouseup = () => {
                this.stopDragBlock();
            }
        }

        this.setupDraggableBlocks(options);
    }

    public setupDraggableBlocks = (options: TDraggableOptions) => {
        this.lastOptions = options;
        const { draggableBlocksSelector, editorWindowElem } = options;
        this.canInsertBlock = options.canInsertBlock
        this.onBlockInserted = options.onBlockInserted;
        this.hasToMoveElements = options.hasToMoveElements ?? true;

        // temp timeout
        setTimeout(() => {
            this.draggableBlocks = Array.from(document.querySelectorAll(draggableBlocksSelector)) as HTMLElement[];
            // console.log('draggableBlocks', this.draggableBlocks, draggableBlocksSelector);
            this.draggableBlocks.forEach(b => {
                if (b) this.setupBlock(b);
            })
        }, 100)
    }

    public updateBlocks = () => {
        if (!this.lastOptions) {
            console.error('No options provided. Call setupDraggableBlocks first');
            return;
        }
        const { draggableBlocksSelector } = this.lastOptions;
        const updatedBlocks = Array.from(document.querySelectorAll(draggableBlocksSelector)) as HTMLElement[];
        // Clear old blocks that are not contains in new array
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

    }

    private setupBlock = (block: HTMLElement) => {
        if (!block || !this.lastOptions) return;
        const { editorWindowElem } = this.lastOptions;
        // const draggableFrame: HTMLElement | null = b.querySelector(draggableFrameSelector)
        const draggableFrame: HTMLElement = document.createElement('div');
        draggableFrame.classList.add(this.draggableFrameClass);

        block.appendChild(draggableFrame);
        block.classList.add(this.draggableBlockClass);

        this.draggableFrames.push(draggableFrame);

        draggableFrame.addEventListener('click', (e) => {
            this.onBlockClick(block, draggableFrame, e);
        })
        block.addEventListener('click', (e) => {
            this.onBlockClick(block, draggableFrame, e);
        })

        block.onmousedown = (e) => {
            e.stopPropagation();
            this.onBlockMouseDown(block, editorWindowElem, e);
        }

        block.onmouseover = (e) => {
            e.stopPropagation();
            this.onBlockHoverStart(block, draggableFrame);
        }

        block.onmouseleave = (e) => {
            e.stopPropagation();
            this.onBlockHoverEnd();
        }
    }

    private clearBlock = (block: HTMLElement) => {
        const frames = block.querySelectorAll(`.${this.draggableFrameClass}`);
        frames.forEach(frame => frame.remove());
        block.classList.remove(this.draggableBlockClass);
        block.onmousedown = null;
        block.onmouseover = null;
        block.onmouseleave = null;
    }

    private onMouseMove = (event: MouseEvent) => {
        // console.log('canDragBlock', canDragBlock, 'draggingBlock', draggingBlock);
        if (this.canDragBlock && this.draggingBlock && this.draggingBlockMoveableCopy) {
            if (!this.isDragging) {
                this.isDragging = true;
                this.onDragStart(event);
            }
            const mousePosYinsideBlock = this.onDragStartInfo?.mousePosYinsideBlock ?? 0;
            const mousePosXinsideBlock = this.onDragStartInfo?.mousePosXinsideBlock ?? 0;

            this.draggingBlockMoveableCopy.style.top = (event.clientY - mousePosYinsideBlock) + 'px';
            this.draggingBlockMoveableCopy.style.left = (event.clientX - mousePosXinsideBlock) + 'px';

            this.tryToInsert(event);
        }
    }

    private onDragStart = (event: MouseEvent) => {
        this.draggingBlockMoveableCopy.style.display = '';
        if (this.draggingBlock && this.draggingBlockMoveableCopy) {
            this.draggingBlock.style.opacity = '0.4';
        }

        const rect = this.draggingBlock.getBoundingClientRect();

        this.onDragStartInfo = {
            mousePosYinsideBlock: (this.onMouseDownInfo?.clientY ?? 0) - rect.top + 10,
            mousePosXinsideBlock: (this.onMouseDownInfo?.clientX ?? 0) - rect.left + 10
        }
    }

    // Inserts immovable shadow at a hovered place if possible
    private tryToInsert = debounce((event: MouseEvent) => {
        // console.log('this.draggingBlockId', this.draggingBlockId, this.draggingBlock, this.hoveredBlockId, this.hoveredBlock);
        if (this.hoveredBlock && this.draggingBlock && this.hoveredBlockId !== this.draggingBlockId) {

            if (this.draggingBlock.contains(this.hoveredBlock)) return;

            const rect = this.hoveredBlock.getBoundingClientRect();
            // const x = event.clientX - rect.left;
            const mousePosYinsideBlock = event.clientY - rect.top;

            let draggingBlockShadowCopy: HTMLElement | null = null;

            const createShadowCopy = () => {
                draggingBlockShadowCopy = this.draggingBlock.cloneNode(true) as HTMLElement;
                draggingBlockShadowCopy.style.pointerEvents = 'none';
                draggingBlockShadowCopy.classList.add(this.draggableShadowClass);
            }

            const parent = this.hoveredBlock.parentNode;
            let hasInserted = false;
            if (parent) {
                // 1/4 move above
                // 2/4 - 3/4 move inside if possible by canInsertBlock, otherwise follow 1/2 / 2/2 abow/below rule
                // 3/4 - move below
                const quarterHeight = this.hoveredBlock.offsetHeight / 4;


                const tryToInsertAbove = () => {
                    if (this.hoveredBlock && this.draggingBlock) {
                        if (this.draggingBlock.nextSibling === this.hoveredBlock) return;
                        const canInsert = (!this.canInsertBlock) ? true : this.canInsertBlock(this.draggingBlock, this.hoveredBlock, 'before');
                        if (canInsert) {
                            // console.log('move above', this.hoveredBlock, this.draggingBlockId);
                            createShadowCopy();

                            parent.insertBefore(draggingBlockShadowCopy, this.hoveredBlock);
                            this.lastPosition = 'before';
                            this.lastTargetBlock = this.hoveredBlock;
                            hasInserted = true;
                        }
                    }
                }

                const tryToInsertBelow = () => {
                    if (this.hoveredBlock && this.draggingBlock) {
                        if (this.hoveredBlock.nextSibling === this.draggingBlock) return;

                        const canInsert = (!this.canInsertBlock) ? true : this.canInsertBlock(this.draggingBlock, this.hoveredBlock, 'after');
                        if (canInsert) {
                            // console.log('move below', this.hoveredBlock, this.draggingBlockId);
                            createShadowCopy();

                            parent.insertBefore(draggingBlockShadowCopy, this.hoveredBlock.nextSibling);
                            this.lastPosition = 'after';
                            this.lastTargetBlock = this.hoveredBlock;
                            hasInserted = true;
                        }
                    }
                }

                const tryToInsertInside = () => {
                    if (this.hoveredBlock && this.draggingBlock) {
                        const canInserInside = (!this.canInsertBlock) ? true : this.canInsertBlock(this.draggingBlock, this.hoveredBlock, 'inside');
                        if (canInserInside && this.hoveredBlock) {
                            // console.log('move inside', this.hoveredBlock, this.draggingBlockId);
                            createShadowCopy();

                            this.hoveredBlock.insertBefore(draggingBlockShadowCopy, null);
                            this.lastPosition = 'inside';
                            this.lastTargetBlock = this.hoveredBlock;
                            hasInserted = true;
                        } else {
                            if (mousePosYinsideBlock < quarterHeight * 2) {
                                tryToInsertAbove();
                            } else {
                                tryToInsertBelow();
                            }
                        }
                    }
                }

                if (mousePosYinsideBlock < quarterHeight) {
                    // move above
                    tryToInsertAbove();
                } else if (mousePosYinsideBlock < quarterHeight * 3) {
                    // move inside
                    tryToInsertInside();
                } else {
                    // move below
                    tryToInsertBelow();
                }
            }
            if (hasInserted) {
                // Delete shadow elem at previous place.
                if (this.draggingBlockShadowCopy) {
                    this.draggingBlockShadowCopy.remove();
                }
                // Save new shadow
                this.draggingBlockShadowCopy = draggingBlockShadowCopy;

                if (draggingBlockShadowCopy) {
                    this.showBlock(draggingBlockShadowCopy);
                    this.hideBlock(this.draggingBlock)
                }
            }
            else {
                if (draggingBlockShadowCopy) draggingBlockShadowCopy.remove();
            }
            // console.log('x', x, 'y', y, 'clientHeight', this.hoveredBlock.offsetHeight)
        }
    }, 100);


    private hideBlock = (block: HTMLElement) => {
        if (block) {
            block.style.padding = '0px';
            block.style.visibility = 'hidden';
            block.style.height = '0px';
            block.style.width = '0px';
            block.style.margin = '0px';
            block.style.padding = '0px';
            block.style.overflow = 'hidden';
            block.style.pointerEvents = 'none';

            setTimeout(() => {
                if (block) {
                    // block.style.display = 'none';
                }
            }, 300)
        }
    }

    private showBlock = (block: HTMLElement) => {
        block.style.display = '';
        block.style.padding = '';
        block.style.visibility = '';
        block.style.height = '';
        block.style.width = '';
        block.style.margin = '';
        block.style.padding = '';
        block.style.overflow = '';
        block.style.pointerEvents = '';
    }

    private onBlockMouseDown = (block: HTMLElement, editorWindowElem?: HTMLElement, event?: MouseEvent) => {
        this.draggingBlock = block;
        this.draggingBlockId = block.id;

        const computedStyle = getComputedStyle(this.draggingBlock);
        // this.draggingBlockHeight = this.draggingBlock.clientHeight - parseFloat(computedStyle.paddingTop) - parseFloat(computedStyle.paddingBottom);
        this.draggingBlockHeight = this.draggingBlock.offsetHeight;
        // this.draggingBlockWidth = this.draggingBlock.clientWidth - parseFloat(computedStyle.paddingLeft) - parseFloat(computedStyle.paddingRight);
        this.draggingBlockWidth = this.draggingBlock.offsetWidth;
        this.draggingBlock.style.height = this.draggingBlockHeight + 'px';
        this.draggingBlock.style.width = this.draggingBlockWidth + 'px';

        this.draggingBlockMoveableCopy = block.cloneNode(true) as HTMLElement;
        this.draggingBlockMoveableCopy.style.position = "fixed";
        this.draggingBlockMoveableCopy.style.display = "none";
        this.draggingBlockMoveableCopy.style.transition = 'none'
        this.draggingBlockMoveableCopy.style.pointerEvents = 'none';
        this.draggingBlockMoveableCopy.style.zIndex = '9999';

        this.onMouseDownInfo = {
            clientY: event.clientY,
            clientX: event.clientX,
        }

        setTimeout(() => {
            if (this.draggingBlock && this.draggingBlockMoveableCopy) {
                this.canDragBlock = true;
                if (editorWindowElem) editorWindowElem.appendChild(this.draggingBlockMoveableCopy);
                else {
                    const bodyElem = document.querySelector('body');
                    if (bodyElem) {
                        bodyElem.appendChild(this.draggingBlockMoveableCopy);
                    }
                }
            }
            else this.stopDragBlock();
        }, 100);
    }

    private onBlockHoverStart = (block: HTMLElement, frame: HTMLElement) => {
        if (this.hoveredBlockId === block.id) return;

        this.hoveredBlock = block;
        this.hoveredBlockId = block.id;

        this.draggableFrames.forEach(this.deselectFrame);

        this.hoverFrame(frame)

        this.draggableBlocks && this.draggableBlocks.forEach(b => b ? b.style.zIndex = '2' : '');
        this.hoveredBlock.style.zIndex = '5';
        // console.log('onmouseover hoveredBlockId', this.hoveredBlockId);
    }

    private onBlockHoverEnd = () => {
        if (!this.hoveredBlockId) return;
        this.draggableFrames.forEach(this.deselectFrame);
        this.draggableBlocks && this.draggableBlocks.forEach(b => b ? b.style.zIndex = '2' : '');
        this.hoveredBlock = null;
        this.hoveredBlockId = null;
        // console.log('onmouseleave hoveredBlockId', this.hoveredBlockId);
    }

    private onBlockClick = (block: HTMLElement, frame: HTMLElement, event: MouseEvent) => {
        event.stopPropagation();
        this.draggableFrames.forEach(this.deselectFrame);
        this.selectFrame(frame);
        this.lastOptions?.onBlockSelected?.(block);
    }

    private hoverFrame = (frame: HTMLElement) => {
        const color = this.lastOptions?.primaryColor ?? '#9900CC';
        frame.classList.add(this.draggableFrameHoveredCSSclass);
        frame.style.border = `1px solid ${color}`;
    }

    private selectFrame = (frame: HTMLElement) => {
        const color = this.lastOptions?.primaryColor ?? '#9900CC';
        frame.classList.add(this.draggableFrameHoveredCSSclass);
        frame.style.border = `2px solid ${color}`;
    }

    private deselectFrame = (frame: HTMLElement) => {
        frame.classList.remove(this.draggableFrameHoveredCSSclass);
        frame.style.border = '0';
    }

    private stopDragBlock = () => {
        if (this.draggingBlockShadowCopy) {
            // If this.draggingBlockShadowCopy is not null, then we inserted shadow in last drag action
            // Insert actual block (this.draggingBlock) instead and remove shadow 
            if (this.draggingBlock) {
                const parent = this.draggingBlockShadowCopy.parentElement;
                if (parent) {
                    if (this.lastTargetBlock && this.onBlockInserted && this.lastPosition)
                        this.onBlockInserted(this.draggingBlock, this.lastTargetBlock, this.lastPosition);

                    if (this.hasToMoveElements) {
                        parent.replaceChild(this.draggingBlock, this.draggingBlockShadowCopy)
                    }
                }
                // this.draggingBlock.remove();
                // this.draggingBlock = null;
            }
            // this.draggingBlockShadowCopy.style.opacity = '';
            this.draggingBlockShadowCopy.remove();
            this.draggingBlockShadowCopy = null;
        }
        if (this.draggingBlock) {
            this.showBlock(this.draggingBlock);
            this.draggingBlock.style.opacity = '';
        }
        this.draggingBlock = null;
        this.draggingBlockId = null;
        this.draggingBlockMoveableCopy = null;
        this.canDragBlock = false;
        this.isDragging = false;
    }
}
