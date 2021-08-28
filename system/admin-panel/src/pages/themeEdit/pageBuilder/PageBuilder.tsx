import {
    sleep,
    TCromwellBlock,
    TCromwellBlockData,
    TCromwellBlockType,
    TCromwellStore,
    TPageConfig,
    TPluginEntity,
    getRandStr,
} from '@cromwell/core';
import { blockCssClass, getBlockHtmlType, getBlockIdFromHtml, pageRootContainerId } from '@cromwell/core-frontend';
import React, { Component } from 'react';

import { Draggable } from '../../../helpers/Draggable/Draggable';
import { PageBuilderSidebar } from '../pageBuilderSidebar/PageBuilderSidebar';
import { TBlockMenuProps } from './blocks/BlockMenu';
import { BlockMenu } from './blocks/BlockMenu';
import styles from './PageBuilder.module.scss';

type THistoryItem = {
    local: string;
    global: string;
}

export class PageBuilder extends Component<{
    getInst: (inst: PageBuilder) => any;
    editingPageInfo: TPageConfig;
    plugins: TPluginEntity[] | null;
    onPageModificationsChange: (modifications: TCromwellBlockData[] | null | undefined) => void;
}> {
    private editingFrameRef = React.createRef<HTMLIFrameElement>();
    private editorWidgetWrapper: HTMLElement;
    private contentWindow: Window;
    private contentStore: TCromwellStore;
    private contentFrontend: typeof import('@cromwell/core-frontend');
    private getStoreItem: (typeof import('@cromwell/core'))['getStoreItem'];
    private setStoreItem: (typeof import('@cromwell/core'))['setStoreItem'];
    private getBlockData: (typeof import('@cromwell/core-frontend'))['getBlockData'];
    private getBlockElementById: (typeof import('@cromwell/core-frontend'))['getBlockElementById'];
    private getBlockById: (typeof import('@cromwell/core-frontend'))['getBlockById'];

    private ignoreDraggableClass: string = pageRootContainerId;
    private draggable: Draggable;
    private undoBtnRef = React.createRef<HTMLButtonElement>();
    private redoBtnRef = React.createRef<HTMLButtonElement>();

    public blockInfos: Record<string, {
        canDrag?: boolean;
        canDeselect?: boolean;
    }> = {};

    private hoveredFrames: Record<string, HTMLElement> = {};
    private selectedFrames: Record<string, HTMLElement> = {};
    private selectedBlock: HTMLElement;
    private blockMenu: BlockMenu;
    private pageBuilderSidebar: PageBuilderSidebar;
    private history: THistoryItem[] = [];
    private undoneHistory: THistoryItem[] = [];

    // Keeps track of modifications that user made (added) currently. Does not store all mods from actual pageCofig.
    // We need to send to the server only newly added modifications.
    private _changedModifications: TCromwellBlockData[] | null | undefined = null;
    private get changedModifications(): TCromwellBlockData[] | null | undefined {
        return this._changedModifications;
    }
    private set changedModifications(data) {
        if (data) {
            this.props.onPageModificationsChange(data);
        }
        this._changedModifications = data;
    }

    constructor(props) {
        super(props);
        props.getInst(this);
    }

    componentDidMount() {
        this.init();
    }

    private init = async () => {
        if (!this.editingFrameRef.current) {
            console.error('!this.editingFrameRef.current');
            return;
        }
        this.contentWindow = this.editingFrameRef.current.contentWindow;
        this.editorWidgetWrapper = document.getElementById('editorWidgetWrapper');

        const awaitInit = async () => {
            if (!this.contentWindow.CromwellStore?.nodeModules?.modules?.['@cromwell/core-frontend']) {
                await sleep(0.2);
                await awaitInit();
            }
        }
        await awaitInit();

        this.contentWindow.document.body.style.userSelect = 'none';
        this.contentStore = this.contentWindow.CromwellStore;
        this.contentFrontend = this.contentStore.nodeModules?.modules?.['@cromwell/core-frontend'];
        this.getBlockElementById = this.contentFrontend.getBlockElementById;
        this.getBlockData = this.contentFrontend.getBlockData;
        this.getBlockById = this.contentFrontend.getBlockById;
        this.getStoreItem = this.contentStore.nodeModules?.modules?.['@cromwell/core'].getStoreItem;
        this.setStoreItem = this.contentStore.nodeModules?.modules?.['@cromwell/core'].setStoreItem;
        (window as any).PageBuilder2 = this;

        this.contentStore.forceUpdatePage();

        this.draggable = new Draggable({
            document: this.contentWindow.document,
            draggableSelector: `.${blockCssClass}`,
            containerSelector: `.${getBlockHtmlType('container')}`,
            rootElement: this.contentWindow.document.getElementById('CB_root'),
            disableInsert: true,
            ignoreDraggableClass: this.ignoreDraggableClass,
            canInsertBlock: this.canInsertBlock,
            onBlockInserted: this.onBlockInserted,
            onBlockSelected: this.onBlockSelected,
            onBlockDeSelected: this.onBlockDeSelected,
            canDeselectBlock: this.canDeselectBlock,
            canDragBlock: this.canDragBlock,
            getFrameColor: this.getFrameColor,
            onBlockHoverStart: this.onBlockHoverStart,
            onBlockHoverEnd: this.onBlockHoverEnd,
            onTryToInsert: this.onTryToInsert,
            dragPlacement: 'underline',
            disableClickAwayDeselect: true,
        });

        const styles = this.contentWindow.document.createElement('style');
        styles.innerHTML = `
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
        }`;
        this.contentWindow.document.head.appendChild(styles);

        const rootBlock = this.getBlockById(pageRootContainerId);
        if (rootBlock) rootBlock.addDidUpdateListener('PageBuilder', () => {
            this.updateDraggable();
        });

        document.body.addEventListener('mouseup', this.onMouseUp);
        this.checkHistoryButtons();
        this.updateDraggable();
    }

    public updateDraggable = () => {
        this.draggable?.updateBlocks();

        const allElements = Array.from(this.contentWindow.document.getElementsByTagName('*') ?? []);
        allElements.forEach((el: HTMLElement) => {
            // Disable all links
            el.onclick = (e) => { e.preventDefault() }
            el.addEventListener('scroll', this.onAnyElementScroll);
        });
    }

    public onAnyElementScroll = () => {
        this.updateFramesPosition();
    }

    public updateFramesPosition = () => {
        Object.keys(this.selectedFrames).forEach(id => {
            const block = this.getBlockElementById(getBlockIdFromHtml(id));
            if (block && this.selectedFrames[id]) this.setFramePosition(block, this.selectedFrames[id]);
        });

        Object.keys(this.hoveredFrames).forEach(id => {
            const block = this.getBlockElementById(getBlockIdFromHtml(id));
            if (block && this.hoveredFrames[id]) this.setFramePosition(block, this.hoveredFrames[id]);
        });
    }

    private onMouseUp = () => {
        this.draggable?.onMouseUp();
    }

    public canInsertBlock = () => {
        return true;
    }

    public onTryToInsert = (container: HTMLElement, draggedBlock: HTMLElement, shadow?: HTMLElement | null) => {
        if (!shadow) return;
        shadow.style.zIndex = '100000';
        shadow.style.position = 'relative';

        const shadowFrame = this.contentWindow.document.createElement('div');
        shadowFrame.style.border = `2px solid aqua`;
        shadowFrame.style.zIndex = '10000';
        shadowFrame.style.position = 'absolute';
        shadowFrame.style.top = '0';
        shadowFrame.style.bottom = '0';
        shadowFrame.style.right = '0';
        shadowFrame.style.left = '0';

        shadow.appendChild(shadowFrame);
    }

    private setFramePosition = (block: HTMLElement, frame: HTMLElement) => {
        const bounding = block.getBoundingClientRect();
        frame.style.position = 'absolute';
        frame.style.top = (this.contentWindow.pageYOffset + bounding.top) + 'px';
        frame.style.left = (this.contentWindow.pageXOffset + bounding.left) + 'px';
    }

    private createBlockFrame = (block: HTMLElement) => {
        const selectableFrame = this.contentWindow.document.createElement('div');
        selectableFrame.style.zIndex = '10';
        selectableFrame.style.pointerEvents = 'none';
        selectableFrame.style.height = block.offsetHeight + 'px';
        selectableFrame.style.width = block.offsetWidth + 'px';
        selectableFrame.style.border = `1px solid ${this.getFrameColor(block)}`;
        this.setFramePosition(block, selectableFrame);
        return selectableFrame;
    }

    public onBlockSelected = (block: HTMLElement) => {
        if (!block) return;
        if (this.selectedFrames[block.id]) return;

        if (this.selectedBlock) {
            this.selectedBlock.style.cursor = 'initial';
        }
        this.selectedBlock = block;
        this.selectedBlock.style.cursor = 'move';

        Object.values(this.selectedFrames).forEach(frame => frame?.remove())
        this.selectedFrames = {};

        const frame = this.createBlockFrame(block);
        frame.style.border = `2px solid ${this.getFrameColor(block)}`;

        this.editorWidgetWrapper.appendChild(frame);
        this.selectedFrames[block.id] = frame;
        const crwBlock = this.getBlockById(getBlockIdFromHtml(block.id));

        this.blockMenu.setSelectedBlock(frame, block, crwBlock);
        this.pageBuilderSidebar.setSelectedBlock(block, crwBlock);
        this.updateDraggable();
    }

    public onBlockDeSelected = (block: HTMLElement) => {
        if (!block) return;
        this.blockMenu.setSelectedBlock(null, null, null);
        this.pageBuilderSidebar.setSelectedBlock(null, null);
        this.selectedFrames[block.id]?.remove();
        delete this.selectedFrames[block.id];
        this.updateDraggable();
    }

    public deselectBlock = (block: HTMLElement) => {
        this.draggable?.deselectCurrentBlock();
        this.onBlockDeSelected(block);
    }

    public selectBlock = (blockData: TCromwellBlockData) => {
        this.draggable?.deselectCurrentBlock();
        this.onBlockSelected(this.getBlockElementById(blockData.id));
    }

    public onBlockHoverStart = (block: HTMLElement) => {
        if (!block) return;
        if (this.hoveredFrames[block.id]) return;
        const frame = this.createBlockFrame(block);
        frame.style.border = `1px solid ${this.getFrameColor(block)}`;
        frame.style.userSelect = 'none';
        frame.setAttribute('draggable', 'false');

        this.editorWidgetWrapper.appendChild(frame);
        this.hoveredFrames[block.id] = frame;
    }

    public onBlockHoverEnd = (block: HTMLElement) => {
        if (!block) return;
        this.hoveredFrames[block.id]?.remove();
        delete this.hoveredFrames[block.id];
    }

    public canDeselectBlock = (draggedBlock: HTMLElement) => {
        const blockData = Object.assign({}, this.getBlockData(draggedBlock));
        if (blockData?.id) {
            return this.blockInfos[blockData?.id]?.canDeselect ?? true;
        }
        return true;
    }

    public canDragBlock = (draggedBlock: HTMLElement) => {
        const blockData = Object.assign({}, this.getBlockData(draggedBlock));
        if (blockData?.id) {
            return this.blockInfos[blockData?.id]?.canDrag ?? true;
        }
        return true;
    }

    public getFrameColor = (elem: HTMLElement) => {
        if (this.isGlobalElem(elem)) return '#ff9100';
        return '#9900CC';
    }

    private onBlockInserted = async (container: HTMLElement, draggedBlock: HTMLElement, nextElement?: HTMLElement | null) => {
        const blockData = Object.assign({}, this.getBlockData(draggedBlock));
        const newParentData = Object.assign({}, this.getBlockData(container));
        // const oldParentData = Object.assign({}, getBlockData(draggedBlock?.parentNode));
        const nextData = this.getBlockData(nextElement);

        // Invalid block - no id, or instance was not found in the global store.
        if (!blockData?.id) {
            console.error('!blockData.id: ', draggedBlock);
            return;
        }
        if (!newParentData?.id) {
            console.error('!parentData.id: ', draggedBlock);
            return;
        }
        // console.log('onBlockInserted newParentData.id', newParentData.id, 'blockData.id', blockData.id, 'before', nextElement)

        this.addBlock({
            blockData,
            targetBlockData: nextData,
            parentData: this.getBlockData(container),
            position: 'before'
        });

        // const blockPromise = this.rerenderBlock(blockData.id);
        // const newParentPromise = this.rerenderBlock(newParentData.id);
        // let oldParentPromise;
        // if (oldParentData?.id) oldParentPromise = this.rerenderBlock(oldParentData.id);
        // await Promise.all([blockPromise, newParentPromise, oldParentPromise]);

        await this.rerenderBlocks();

        this.draggable?.updateBlocks();

        setTimeout(() => {
            this.getBlockElementById(blockData.id)?.click();
            this.selectBlock(blockData);
        }, 100);
    }

    public addBlock = (config: {
        blockData: TCromwellBlockData;
        targetBlockData?: TCromwellBlockData;
        parentData?: TCromwellBlockData;
        position: 'before' | 'after';
    }): TCromwellBlockData[] => {
        const { targetBlockData, position } = config;
        const blockData = Object.assign({}, config.blockData);

        const parentData = this.getBlockData(this.getBlockElementById(targetBlockData?.id)?.parentNode) ?? config?.parentData;
        const parent = this.getBlockElementById(parentData.id);
        if (!parentData || !parent) {
            console.warn('Failed to add new block, parent was not found: ', parentData, parent, ' block data: ', blockData)
            return;
        }

        const childrenData: TCromwellBlockData[] = [];

        let iteration = 0;
        let newBlockIndex = -1;

        // Sort parent's children
        Array.from(parent.children).forEach((child) => {
            const childData = Object.assign({}, this.getBlockData(child));
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

            this.modifyBlock(childData, false);
        });

        if (newBlockIndex === -1) {
            newBlockIndex = iteration;
            childrenData.push(blockData);
        }

        blockData.parentId = parentData.id;
        blockData.index = newBlockIndex;
        blockData.global = this.isGlobalElem(parent);

        this.modifyBlock(blockData);

        return childrenData;
    }

    public modifyBlock = (blockData: TCromwellBlockData, saveHist?: boolean) => {
        if (!this.changedModifications) this.changedModifications = [];
        // Save history
        if (saveHist !== false) this.saveCurrentState();

        // Save to global modifications in pageConfig.
        const pageConfig: TPageConfig = this.getStoreItem('pageConfig') ?? {} as TPageConfig;
        if (!pageConfig.modifications) pageConfig.modifications = [];
        pageConfig.modifications = this.addToModifications(blockData, pageConfig.modifications);
        this.setStoreItem('pageConfig', pageConfig);

        // Add to local changedModifications (contains only newly added changes);
        this.changedModifications = this.addToModifications(blockData, this.changedModifications);
    }

    /**
   * Saves block into provided array, returns a new array, provided isn't modified
   * @param data 
   * @param mods 
   */
    private addToModifications = (data: TCromwellBlockData, mods: TCromwellBlockData[]):
        TCromwellBlockData[] => {
        let modIndex: number | null = null;
        mods = [...mods];
        mods.forEach((mod, i) => {
            if (mod.id === data.id) modIndex = i;
        });
        if (modIndex !== null) {
            mods[modIndex] = data;
        } else {
            mods.push(data);
        }
        return mods;
    }

    public saveCurrentState = () => {
        const current = this.getCurrentModificationsState();

        if (this.history[this.history.length - 1]?.local !== current.local) {
            this.history.push(current);
        }

        this.undoneHistory = [];

        if (this.history.length > 20) {
            this.history.shift();
        }
        this.checkHistoryButtons();
    }

    private getCurrentModificationsState = (): THistoryItem => {
        const pageConfig = this.getStoreItem('pageConfig');
        return {
            global: JSON.stringify(pageConfig?.modifications ?? []),
            local: JSON.stringify(this.changedModifications),
        }
    }

    private checkHistoryButtons = () => {
        const disableButton = (button: HTMLButtonElement) => {
            button.style.opacity = '0.4';
            const ripple = button.querySelector<HTMLSpanElement>('.MuiTouchRipple-root');
            if (ripple) {
                ripple.style.opacity = '0';
                ripple.style.transition = '0.4s';
            }
        }
        const enableButton = (button: HTMLButtonElement) => {
            button.style.opacity = '1';
            const ripple = button.querySelector<HTMLSpanElement>('.MuiTouchRipple-root');
            if (ripple) {
                ripple.style.transition = '0.4s';
                ripple.style.opacity = '1';
            }
        }

        if (this.undoBtnRef.current) {
            if (this.history.length > 0) enableButton(this.undoBtnRef.current)
            else disableButton(this.undoBtnRef.current);
        }

        if (this.redoBtnRef.current) {
            if (this.undoneHistory.length > 0) enableButton(this.redoBtnRef.current)
            else disableButton(this.redoBtnRef.current);
        }
    }

    public async rerenderBlock(id: string) {
        const instances = this.getStoreItem('blockInstances');
        let blockInst: TCromwellBlock | null = null;
        if (instances) {
            Object.values(instances).forEach(inst => {
                if (inst?.getData()?.id === id && inst?.rerender) blockInst = inst;

            })
        }
        if (blockInst) await blockInst.rerender();
    }

    public async rerenderBlocks() {
        // Re-render blocks
        const instances = this.getStoreItem('blockInstances');
        const promises: Promise<any>[] = [];
        if (instances) {
            Object.values(instances).forEach(inst => {
                if (inst?.rerender) {
                    const p = inst.rerender();
                    if (p) promises.push(p);
                }
            })
        }
        await Promise.all(promises);
        this.updateDraggable();
    }


    public undoModification = () => {
        const last = this.history.pop();
        if (last) {
            this.undoneHistory.push(this.getCurrentModificationsState());
            this.applyHistory(last);
        }
    }

    public redoModification = () => {
        if (this.undoneHistory.length > 0) {
            const last = this.undoneHistory.pop();
            this.saveCurrentState();
            this.applyHistory(last);
        }
    }

    private applyHistory = async (history: THistoryItem) => {
        const pageConfig = this.getStoreItem('pageConfig');
        pageConfig.modifications = JSON.parse(history.global);
        this.setStoreItem('pageConfig', pageConfig);
        this.changedModifications = JSON.parse(history.local);
        await new Promise(done => setTimeout(done, 100));
        await this.rerenderBlocks();

        if (this.selectedBlock) this.selectBlock(this.getBlockData(this.selectedBlock));
        this.checkHistoryButtons();
    }

    public deleteBlock = async (blockData: TCromwellBlockData) => {
        if (blockData) {
            blockData.isDeleted = true;
            this.modifyBlock(blockData);
        }
        this.deselectBlock(this.getBlockElementById(blockData.id));
        await this.rerenderBlocks();

        this.draggable?.updateBlocks();
    }


    public createNewBlock = async (newBlockType: TCromwellBlockType, afterBlockData: TCromwellBlockData, containerData?: TCromwellBlockData) => {
        const newBlock: TCromwellBlockData = {
            id: `_${getRandStr()}`,
            type: newBlockType,
            isVirtual: true,
        }
        if (containerData && containerData.type !== 'container') containerData = undefined;

        this.addBlock({
            blockData: newBlock,
            targetBlockData: containerData ? undefined : afterBlockData,
            parentData: containerData,
            position: 'after',
        });

        await this.rerenderBlocks();

        // Select new block
        setTimeout(() => {
            this.getBlockElementById(newBlock.id)?.click();
            this.selectBlock(newBlock);
        }, 200);
    }

    private createBlockProps = (block?: TCromwellBlock): TBlockMenuProps => {
        const data = block?.getData();
        const bId = data?.id;
        const bType = data?.type;
        const deleteBlock = () => {
            if (!data.global && this.isGlobalElem(this.getBlockElementById(data?.id))) {
                data.global = true;
            }
            this.deleteBlock(data);
        }
        const handleCreateNewBlock = (newBType: TCromwellBlockType) =>
            this.createNewBlock(newBType, data, bType === 'container' ? data : undefined);

        const blockProps: TBlockMenuProps = {
            block: block,
            isGlobalElem: this.isGlobalElem,
            modifyData: (blockData: TCromwellBlockData) => {
                if (!blockData.global && this.isGlobalElem(this.getBlockElementById(blockData?.id))) {
                    blockData.global = true;
                }
                this.modifyBlock(blockData);
                block?.rerender();
            },
            deleteBlock: deleteBlock,
            addNewBlockAfter: handleCreateNewBlock,
            plugins: this.props.plugins,
            setCanDrag: (canDrag: boolean) => {
                if (!this.blockInfos[bId]) this.blockInfos[bId] = {};
                this.blockInfos[bId].canDrag = canDrag;
            },
            setCanDeselect: (canDeselect: boolean) => {
                if (!this.blockInfos[bId]) this.blockInfos[bId] = {};
                this.blockInfos[bId].canDeselect = canDeselect;
            },
        }
        return blockProps;
    }


    public isGlobalElem = (elem?: HTMLElement): boolean => {
        if (!elem) return false;
        const data = this.getBlockData(elem);
        if (data?.global) return true;
        if (data?.id === 'root') return false;
        const parent = elem?.parentElement;
        if (parent) {
            return this.isGlobalElem(parent);
        }
        return false;
    }

    render() {
        const { editingPageInfo, getInst } = this.props;
        getInst(this);

        return (
            <div className={styles.PageBuilder} >
                <div id="editorWidgetWrapper" className={styles.editorWidgetWrapper}></div>
                <BlockMenu
                    getInst={inst => this.blockMenu = inst}
                    deselectBlock={this.deselectBlock}
                    createBlockProps={this.createBlockProps}
                />
                <iframe
                    className={styles.frameEditor}
                    src={`${window.location.origin}/${editingPageInfo.route}`}
                    ref={this.editingFrameRef}
                />
                <PageBuilderSidebar
                    getInst={inst => this.pageBuilderSidebar = inst}
                    deselectBlock={this.deselectBlock}
                    // undoBtnRef={this.undoBtnRef}
                    // redoBtnRef={this.redoBtnRef}
                    createBlockProps={this.createBlockProps}
                />
            </div>
        )
    }
}