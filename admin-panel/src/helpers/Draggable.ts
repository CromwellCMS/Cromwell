import { debounce } from "debounce";

export class Draggable {

    private draggingBlock: HTMLDivElement | null = null;
    private draggingBlockId: string | null = null;
    private draggableBlocks: NodeListOf<HTMLDivElement> | null = null;
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

    constructor(editorWindowElem: HTMLDivElement | null, draggableBlocksClass: string, draggableFrameCSSslass: string) {
        // check for underlying blocks to move to
        const bodyElem = document.querySelector('body');

        if (bodyElem) {
            bodyElem.onmousemove = this.onMouseMove;
            bodyElem.onmouseup = () => {
                this.stopDragBlock();
            }
        }

        this.setupDraggableBlocks(
            editorWindowElem,
            draggableBlocksClass,
            draggableFrameCSSslass);
    }

    private onMouseMove = (event) => {
        // console.log('canDragBlock', canDragBlock, 'draggingBlock', draggingBlock);
        if (this.canDragBlock && this.draggingBlock && this.draggingBlockMoveableCopy) {
            if (!this.isDragging) {
                this.isDragging = true;
                this.draggingBlockMoveableCopy.style.display = "block";
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

    public setupDraggableBlocks = (editorWindowElem: HTMLDivElement | null, draggableBlocksClass: string, draggableFrameCSSslass: string) => {
        // temp timeout
        setTimeout(() => {
            this.draggableBlocks = document.querySelectorAll(draggableBlocksClass);
            // console.log('draggableBlocks', this.draggableBlocks, draggableBlocksClass);
            this.draggableBlocks.forEach(b => {
                const draggableFrame: HTMLDivElement | null = b.querySelector(draggableFrameCSSslass)
                if (draggableFrame) {
                    draggableFrame.onclick = () => {
                        console.log('draggableElement', b.id);
                    }

                    draggableFrame.onmousedown = () => {
                        this.draggingBlock = b;
                        this.draggingBlockId = b.id;

                        this.draggingBlockMoveableCopy = b.cloneNode(true) as HTMLDivElement;
                        this.draggingBlockMoveableCopy.style.position = "fixed";
                        this.draggingBlockMoveableCopy.style.display = "none";
                        this.draggingBlockMoveableCopy.style.transition = 'none'
                        this.draggingBlockMoveableCopy.style.backgroundColor = 'rgba(0,255,255,0.5)';
                        this.draggingBlockMoveableCopy.style.pointerEvents = 'none';
                        this.draggingBlockMoveableCopy.style.zIndex = '9999';

                        const computedStyle = getComputedStyle(this.draggingBlock);
                        this.draggingBlockHeight = this.draggingBlock.clientHeight - parseFloat(computedStyle.paddingTop) - parseFloat(computedStyle.paddingBottom);
                        this.draggingBlockWidth = this.draggingBlock.clientWidth - parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);
                        this.draggingBlock.style.height = this.draggingBlockHeight + 'px';
                        this.draggingBlock.style.width = this.draggingBlockWidth + 'px';

                        setTimeout(() => {
                            if (this.draggingBlock && this.draggingBlockMoveableCopy) {
                                this.canDragBlock = true;
                                if (editorWindowElem) editorWindowElem.appendChild(this.draggingBlockMoveableCopy);
                            }
                            else this.stopDragBlock();
                        }, 200);
                    }

                }

                b.onmouseenter = () => {
                    this.hoveredBlock = b;
                    this.hoveredBlockId = b.id;
                    // console.log('hoveredBlockId', this.hoveredBlockId);
                }

                b.onmouseleave = () => {
                    this.hoveredBlock = null;
                    this.hoveredBlockId = null;
                    // console.log('hoveredBlockId', this.hoveredBlockId);
                }
            })
        }, 100)
    }

    public stopDragBlock = () => {
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
        this.draggingBlockMoveableCopy = null;
        this.canDragBlock = false;
        this.isDragging = false;
    }
}
