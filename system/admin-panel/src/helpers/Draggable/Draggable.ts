import { debounce } from "debounce";

export class Draggable {

    private draggingBlock: HTMLDivElement | null = null;
    private draggingBlockId: string | null = null;
    private draggableBlocks: NodeListOf<HTMLDivElement> | null = null;
    private draggableFrames: HTMLDivElement[] = [];
    private isDragging = false;
    private draggingBlockHeight = 0;
    private draggingBlockWidth = 0;

    private _draggingBlockCopy: HTMLDivElement | null = null;
    private set draggingBlockMoveableCopy(val) {
        if (this._draggingBlockCopy) this._draggingBlockCopy.remove();
        this._draggingBlockCopy = val;
    }
    private get draggingBlockMoveableCopy() {
        return this._draggingBlockCopy;
    }

    private _draggingBlockShadowCopy: HTMLDivElement | null = null;
    private set draggingBlockShadowCopy(val) {
        if (this._draggingBlockShadowCopy) this._draggingBlockShadowCopy.remove();
        this._draggingBlockShadowCopy = val;
    }
    private get draggingBlockShadowCopy() {
        return this._draggingBlockShadowCopy;
    }

    private hoveredBlock: HTMLDivElement | null = null;
    private hoveredBlockId: string | null = null;
    private canDragBlock: boolean = false;

    private draggableFrameHoveredCSSclass?: string;
    private draggableFrameSelectedCSSclass?: string;

    constructor(
        draggableBlocksSelector: string,
        editorWindowElem?: HTMLDivElement,
        // draggableFrameSelector: string,
        // draggableFrameHoveredCSSclass?: string,
        // draggableFrameSelectedCSSclass?: string
    ) {
        // check for underlying blocks to move to
        const bodyElem = document.querySelector('body');

        this.draggableFrameHoveredCSSclass = 'DraggableBlock__frame_hovered';
        this.draggableFrameSelectedCSSclass = 'DraggableBlock__frame_selected';

        if (bodyElem) {
            bodyElem.onmousemove = this.onMouseMove;
            bodyElem.onmouseup = () => {
                this.stopDragBlock();
            }
        }

        this.setupDraggableBlocks(draggableBlocksSelector, editorWindowElem);
    }

    private onMouseMove = (event) => {
        // console.log('canDragBlock', canDragBlock, 'draggingBlock', draggingBlock);
        if (this.canDragBlock && this.draggingBlock && this.draggingBlockMoveableCopy) {
            if (!this.isDragging) {
                this.isDragging = true;
                this.draggingBlockMoveableCopy.style.display = '';
                if (this.draggingBlock && this.draggingBlockMoveableCopy) {
                    this.draggingBlock.style.opacity = '0.4';
                }
            }
            this.draggingBlockMoveableCopy.style.top = (event.clientY - this.draggingBlockMoveableCopy.offsetHeight / 2) + 'px';
            this.draggingBlockMoveableCopy.style.left = (event.clientX - this.draggingBlockMoveableCopy.offsetWidth / 2) + 'px';

            this.tryToInsert(event);
        }
    }

    private tryToInsert = debounce((event: MouseEvent) => {
        // console.log('this.draggingBlockId', this.draggingBlockId, this.draggingBlock, this.hoveredBlockId, this.hoveredBlock);
        if (this.hoveredBlock && this.draggingBlock && this.hoveredBlockId !== this.draggingBlockId) {
            var rect = this.hoveredBlock.getBoundingClientRect();
            var x = event.clientX - rect.left;
            var y = event.clientY - rect.top;

            const draggingBlockShadowCopy = this.draggingBlock.cloneNode(true) as HTMLDivElement;
            draggingBlockShadowCopy.style.pointerEvents = 'none';

            const parent = this.hoveredBlock.parentNode;
            let hasInserted = false;
            if (parent) {
                if (y < this.hoveredBlock.offsetHeight / 2) {
                    // move above
                    // console.log(prev.id, this.draggingBlockId);
                    parent.insertBefore(draggingBlockShadowCopy, this.hoveredBlock);
                    hasInserted = true;
                } else {
                    // move below
                    // console.log(next.id, this.draggingBlockId);
                    parent.insertBefore(draggingBlockShadowCopy, this.hoveredBlock.nextSibling);
                    hasInserted = true;
                }
            }
            if (hasInserted) {
                if (this.draggingBlockShadowCopy) {
                    this.draggingBlockShadowCopy.remove();
                }
                this.draggingBlockShadowCopy = draggingBlockShadowCopy;
                this.showBlock(this.draggingBlockShadowCopy);
                this.hideBlock(this.draggingBlock);
            }
            else {
                draggingBlockShadowCopy.remove();
            }
            // console.log('x', x, 'y', y, 'clientHeight', this.hoveredBlock.offsetHeight)
        }
    }, 100);


    private hideBlock = (block: HTMLDivElement) => {
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

    private showBlock = (block: HTMLDivElement) => {
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

    public setupDraggableBlocks = (draggableBlocksSelector: string, editorWindowElem?: HTMLDivElement) => {
        // temp timeout
        setTimeout(() => {
            this.draggableBlocks = document.querySelectorAll(draggableBlocksSelector);
            // console.log('draggableBlocks', this.draggableBlocks, draggableBlocksSelector);
            this.draggableBlocks.forEach(b => {
                // const draggableFrame: HTMLDivElement | null = b.querySelector(draggableFrameSelector)
                const draggableFrame: HTMLDivElement = document.createElement('div');
                draggableFrame.classList.add('DraggableBlock__frame');

                b.appendChild(draggableFrame);
                b.classList.add('DraggableBlock');

                this.draggableFrames.push(draggableFrame);

                draggableFrame.onclick = () => {
                    console.log('draggableElement', b.id);
                }

                b.onmousedown = (e) => {
                    e.stopPropagation();
                    this.onBlockMouseDown(b, editorWindowElem);
                }

                b.onmouseover = (e) => {
                    e.stopPropagation();
                    this.onBlockHoverStart(b, draggableFrame);
                }

                b.onmouseleave = (e) => {
                    e.stopPropagation();
                    this.onBlockHoverEnd();
                }
            })
        }, 100)
    }

    private onBlockMouseDown = (block: HTMLDivElement, editorWindowElem?: HTMLDivElement) => {
        this.draggingBlock = block;
        this.draggingBlockId = block.id;

        const computedStyle = getComputedStyle(this.draggingBlock);
        this.draggingBlockHeight = this.draggingBlock.clientHeight - parseFloat(computedStyle.paddingTop) - parseFloat(computedStyle.paddingBottom);
        this.draggingBlockWidth = this.draggingBlock.clientWidth - parseFloat(computedStyle.paddingLeft) - parseFloat(computedStyle.paddingRight);
        this.draggingBlock.style.height = this.draggingBlockHeight + 'px';
        this.draggingBlock.style.width = this.draggingBlockWidth + 'px';

        this.draggingBlockMoveableCopy = block.cloneNode(true) as HTMLDivElement;
        this.draggingBlockMoveableCopy.style.position = "fixed";
        this.draggingBlockMoveableCopy.style.display = "none";
        this.draggingBlockMoveableCopy.style.transition = 'none'
        this.draggingBlockMoveableCopy.style.pointerEvents = 'none';
        this.draggingBlockMoveableCopy.style.zIndex = '9999';

        setTimeout(() => {
            if (this.draggingBlock && this.draggingBlockMoveableCopy) {
                this.canDragBlock = true;
                if (editorWindowElem) editorWindowElem.appendChild(this.draggingBlockMoveableCopy);
            }
            else this.stopDragBlock();
        }, 100);
    }

    private onBlockHoverStart = (block: HTMLDivElement, frame: HTMLDivElement) => {
        if (this.hoveredBlockId === block.id) return;

        this.hoveredBlock = block;
        this.hoveredBlockId = block.id;

        this.draggableFrames.forEach(f => this.draggableFrameHoveredCSSclass && f.classList.remove(this.draggableFrameHoveredCSSclass))

        if (frame && this.draggableFrameHoveredCSSclass) {
            frame.classList.add(this.draggableFrameHoveredCSSclass)
        }

        this.draggableBlocks && this.draggableBlocks.forEach(b => b.style.zIndex = '2');
        this.hoveredBlock.style.zIndex = '5';
        // console.log('onmouseover hoveredBlockId', this.hoveredBlockId);
    }

    private onBlockHoverEnd = () => {
        if (!this.hoveredBlockId) return;
        this.draggableFrames.forEach(f => this.draggableFrameHoveredCSSclass && f.classList.remove(this.draggableFrameHoveredCSSclass));
        this.draggableBlocks && this.draggableBlocks.forEach(b => b.style.zIndex = '2');
        this.hoveredBlock = null;
        this.hoveredBlockId = null;
        // console.log('onmouseleave hoveredBlockId', this.hoveredBlockId);
    }

    private stopDragBlock = () => {
        if (this.draggingBlockShadowCopy) {
            if (this.draggingBlock) {
                const parent = this.draggingBlockShadowCopy.parentElement;
                if (parent) {
                    parent.replaceChild(this.draggingBlock, this.draggingBlockShadowCopy)
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
