import {
    getRandStr,
    getStoreItem,
    setStoreItem,
    TCromwellBlock,
    TCromwellBlockData,
    TCromwellBlockType,
    TPageConfig,
    TPageInfo,
    TPluginEntity,
} from '@cromwell/core';
import {
    BlockContentProvider,
    blockCssClass,
    CContainer,
    getBlockById,
    getBlockData,
    getBlockElementById,
    getBlockHtmlType,
    pageRootContainerId,
} from '@cromwell/core-frontend';
import React from 'react';
import { debounce } from 'throttle-debounce';

import PageErrorBoundary from '../../../components/errorBoundaries/PageErrorBoundary';
import { Draggable } from '../../../helpers/Draggable/Draggable';
import { store } from '../../../redux/store';
import PageBuilderSidebar from '../pageBuilderSidebar/PageBuilderSidebar';
import { TBaseMenuProps } from './blocks/BaseMenu';
import { ContainerBlockReplacer } from './blocks/ContainerBlock';
import { GalleryBlockReplacer } from './blocks/GalleryBlock';
import { HTMLBlockReplacer } from './blocks/HTMLBlock';
import { ImageBlockReplacer } from './blocks/ImageBlock';
import { PluginBlockReplacer } from './blocks/PluginBlock';
import { TextBlockReplacer } from './blocks/TextBlock';
import styles from './PageBuilder.module.scss';

type THistoryItem = {
    local: string;
    global: string;
}

export class PageBuilder extends React.Component<{
    EditingPage: React.ComponentType<any>;
    plugins: TPluginEntity[] | null;
    editingPageInfo: TPageInfo;
    onPageModificationsChange: (modifications: TCromwellBlockData[] | null | undefined) => void;
}>  {

    private editorWindowRef: React.RefObject<HTMLDivElement> = React.createRef();
    public blockInfos: Record<string, {
        canDrag?: boolean;
        canDeselect?: boolean;
    }> = {};
    private ignoreDraggableClass: string = pageRootContainerId;
    private draggable: Draggable;

    private history: THistoryItem[] = [];
    private undoneHistory: THistoryItem[] = [];

    private undoBtnRef = React.createRef<HTMLButtonElement>();
    private redoBtnRef = React.createRef<HTMLButtonElement>();

    componentDidMount() {

        const rootBlock = getBlockById(pageRootContainerId);

        if (rootBlock) rootBlock.addDidUpdateListener('PageBuilder', () => {
            this.updateDraggable();
        });

        this.init();
        this.checkHitoryButtons();
        setTimeout(() => {
            this.updateDraggable();
        }, 500)
    }

    private async init() {
        this.draggable = new Draggable({
            draggableSelector: `.${blockCssClass}`,
            containerSelector: `.${getBlockHtmlType('container')}`,
            rootElement: this.editorWindowRef.current,
            disableInsert: true,
            canInsertBlock: this.canInsertBlock,
            onBlockInserted: this.onBlockInserted,
            onBlockSelected: this.onDraggableBlockSelected,
            onBlockDeSelected: this.onDraggableBlockDeSelected,
            ignoreDraggableClass: this.ignoreDraggableClass,
            canDeselectBlock: this.canDeselectDraggableBlock,
            canDragBlock: this.canDragDraggableBlock,
            getFrameColor: this.getFrameColor,
            createFrame: true,
            iframeSelector: '#builderFrame',
            dragPlacement: 'underline',
            disableClickAwayDeselect: true,
        });
        store.setStateProp({
            prop: 'draggable',
            payload: this.draggable,
        })
    }

    componentWillUnmount() {
        store.setStateProp({
            prop: 'selectedBlock',
            payload: undefined,
        });
    }


    // Keeps track of modifications that user made (added) curently. Does not store all mods from actual pageCofig.
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

    private canInsertBlock = (container: HTMLElement): boolean => {
        const parentData = getBlockData(container);
        if (!parentData?.id) {
            return false;
        }
        return true;
    }

    private onBlockInserted = async (container: HTMLElement, draggedBlock: HTMLElement, nextElement?: HTMLElement | null) => {

        const blockData = Object.assign({}, getBlockData(draggedBlock));
        const newParentData = Object.assign({}, getBlockData(container));
        // const oldParentData = Object.assign({}, getBlockData(draggedBlock?.parentNode));
        const nextData = getBlockData(nextElement);

        // Ivalid block - no id, or instance was not found in the global store.
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
            parentData: getBlockData(container),
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
            getBlockElementById(blockData.id)?.click();
            store.setStateProp({
                prop: 'selectedBlock',
                payload: getStoreItem('blockInstances')?.[blockData.id],
            });
        }, 100);
    }

    public updateDraggable = () => {
        this.draggable?.updateBlocks();
    }

    public modifyBlock = (blockData: TCromwellBlockData, saveHist?: boolean) => {
        if (!this.changedModifications) this.changedModifications = [];
        // Save histroy
        if (saveHist !== false) this.saveCurrentState();

        // Save to global modifications in pageConfig.
        const pageConfig: TPageConfig = getStoreItem('pageConfig') ?? {} as TPageConfig;
        if (!pageConfig.modifications) pageConfig.modifications = [];
        pageConfig.modifications = this.addToModifications(blockData, pageConfig.modifications);
        setStoreItem('pageConfig', pageConfig);

        // Add to local changedModifications (contains only newly added changes);
        this.changedModifications = this.addToModifications(blockData, this.changedModifications);
    }

    private getCurrentModificationsState = (): THistoryItem => {
        const pageConfig = getStoreItem('pageConfig');
        return {
            global: JSON.stringify(pageConfig?.modifications ?? []),
            local: JSON.stringify(this.changedModifications),
        }
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
        this.checkHitoryButtons();
    }

    public saveCurrentStateDebounced = debounce(200, false, () => {
        this.saveCurrentState();
    });

    private checkHitoryButtons = () => {
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
        const pageConfig = getStoreItem('pageConfig');
        pageConfig.modifications = JSON.parse(history.global);
        setStoreItem('pageConfig', pageConfig);
        this.changedModifications = JSON.parse(history.local);
        await new Promise(done => setTimeout(done, 100));
        await this.rerenderBlocks();

        if (store.getState().selectedBlock) {
            store.setStateProp({
                prop: 'selectedBlock',
                payload: Object.assign({}, store.getState().selectedBlock),
            });
        }

        this.checkHitoryButtons();
    }

    public deleteBlock = async (blockData: TCromwellBlockData) => {

        if (blockData) {
            blockData.isDeleted = true;
            this.modifyBlock(blockData);
        }

        store.setStateProp({
            prop: 'selectedBlock',
            payload: undefined,
        });

        await this.rerenderBlocks();

        this.draggable?.updateBlocks();
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

    public async rerenderBlock(id: string) {
        const instances = getStoreItem('blockInstances');
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
        const instances = getStoreItem('blockInstances');
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
    }

    private getFrameColor = (elem: HTMLElement) => {
        if (this.isGlobalElem(elem)) return '#ff9100';
        return '#9900CC';
    }

    private onDraggableBlockSelected = (draggedBlock: HTMLElement) => {
        const blockData = Object.assign({}, getBlockData(draggedBlock));
        if (blockData?.id) {
            this.onBlockSelected(blockData)
        }
    }

    private onDraggableBlockDeSelected = (draggedBlock: HTMLElement) => {
        const blockData = Object.assign({}, getBlockData(draggedBlock));
        if (blockData?.id) {
            this.onBlockDeSelected()
        }
    }

    private canDeselectDraggableBlock = (draggedBlock: HTMLElement): boolean => {
        const blockData = Object.assign({}, getBlockData(draggedBlock));
        if (blockData?.id) {
            return this.canDeselectBlock(blockData);
        }
        return true;
    }

    private canDragDraggableBlock = (draggedBlock: HTMLElement): boolean => {
        const blockData = Object.assign({}, getBlockData(draggedBlock));
        if (blockData?.id) {
            return this.canDragBlock(blockData);
        }
        return true;
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
            getBlockElementById(newBlock.id)?.click();
            store.setStateProp({
                prop: 'selectedBlock',
                payload: getStoreItem('blockInstances')?.[newBlock?.id],
            });
        }, 200);
    }

    public addBlock = (config: {
        blockData: TCromwellBlockData;
        targetBlockData?: TCromwellBlockData;
        parentData?: TCromwellBlockData;
        position: 'before' | 'after';
    }): TCromwellBlockData[] => {
        const { targetBlockData, position } = config;
        const blockData = Object.assign({}, config.blockData);

        const parentData = getBlockData(getBlockElementById(targetBlockData?.id)?.parentNode) ?? config?.parentData;
        const parent = getBlockElementById(parentData.id);
        if (!parentData || !parent) {
            console.warn('Failed to add new block, parent was not found: ', parentData, parent, ' block data: ', blockData)
            return;
        }

        const childrenData: TCromwellBlockData[] = [];

        let iteration = 0;
        let newBlockIndex = -1;

        // Sort parent's children
        Array.from(parent.children).forEach((child) => {
            const childData = Object.assign({}, getBlockData(child));
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

    public isGlobalElem = (elem?: HTMLElement): boolean => {
        if (!elem) return false;
        const data = getBlockData(elem);
        if (data?.global) return true;
        if (data?.id === 'root') return false;
        const parent = elem?.parentElement;
        if (parent) {
            return this.isGlobalElem(parent);
        }
        return false;
    }

    public onBlockSelected = (data: TCromwellBlockData) => {
        store.setStateProp({
            prop: 'selectedBlock',
            payload: getStoreItem('blockInstances')?.[data.id],
        })
    }
    public onBlockDeSelected = () => {
        store.setStateProp({
            prop: 'selectedBlock',
            payload: undefined,
        })
    }

    public canDeselectBlock = (data?: TCromwellBlockData) => {
        return this.blockInfos[data?.id]?.canDeselect ?? true;
    }

    public canDragBlock = (data?: TCromwellBlockData) => {
        return this.blockInfos[data?.id]?.canDrag ?? true;
    }

    public debouncedDidUpdate = debounce(100, () => {
        this.contentDidUpdate();
    });

    public contentDidUpdate = () => {
        this.draggable?.updateBlocks();

        const allElements = Array.from(this.editorWindowRef?.current?.getElementsByTagName('*') ?? []);
        allElements.forEach((el: HTMLElement) => {
            const elStyles = window.getComputedStyle(el);
            // Disable fixed elements
            if (elStyles.position === 'fixed') {
                el.style.position = 'absolute';
            }

            // Clamp z-index to ensure editor's elements aren't covered
            if (elStyles.zIndex) {
                const zIndex = parseInt(elStyles.zIndex);
                if (!isNaN(zIndex) && zIndex > 1000) {
                    el.style.zIndex = '999';
                }
            }

            // Disable all links
            if (el.tagName === 'A') {
                el.onclick = (e) => { e.preventDefault() }
            }

        })
    }

    render() {
        // console.log('PageBuilder render')
        const adminPanelProps = getStoreItem('pageConfig')?.adminPanelProps ?? {};

        const { EditingPage } = this.props;
        return (
            <div ref={this.editorWindowRef} className={styles.PageBuilder}>
                <div className={styles.editingPage}>
                    <BlockContentProvider
                        value={{
                            getter: (block) => {
                                // Will replace content inside any CromwellBlock by JSX this function returns
                                const data = block?.getData();
                                const bType = data?.type;
                                const blockProps = createBlockProps(this)(block);

                                let content;

                                if (bType === 'text') {
                                    content = <TextBlockReplacer
                                        {...blockProps}
                                    />
                                }
                                if (bType === 'plugin') {
                                    content = <PluginBlockReplacer
                                        {...blockProps}
                                    />
                                }
                                if (bType === 'container') {
                                    content = <ContainerBlockReplacer
                                        {...blockProps}
                                    />
                                }
                                if (bType === 'HTML') {
                                    content = <HTMLBlockReplacer
                                        {...blockProps}
                                    />
                                }
                                if (bType === 'image') {
                                    content = <ImageBlockReplacer
                                        {...blockProps}
                                    />
                                }
                                if (bType === 'gallery') {
                                    content = <GalleryBlockReplacer
                                        {...blockProps}
                                    />
                                }

                                if (!content) {
                                    content = block.getDefaultContent();
                                }

                                return <>
                                    {content}
                                </>;
                            },
                            componentDidUpdate: () => {
                                this.debouncedDidUpdate();
                            }
                        }}
                    >
                        <PageErrorBoundary>
                            <CContainer id={pageRootContainerId}
                                className={`${this.ignoreDraggableClass} ${styles.rootBlock}`}
                                isConstant={true}
                            >
                                <EditingPage {...adminPanelProps} />
                            </CContainer>
                        </PageErrorBoundary>
                    </BlockContentProvider>
                </div>
                <PageBuilderSidebar
                    undoBtnRef={this.undoBtnRef}
                    undoModification={this.undoModification}
                    redoBtnRef={this.redoBtnRef}
                    redoModification={this.redoModification}
                    createBlockProps={createBlockProps(this)}
                />
            </div>
        )
    }
}

const createBlockProps = (pbInst: PageBuilder) => (block?: TCromwellBlock): TBaseMenuProps => {
    const data = block?.getData();
    const bId = data?.id;
    const bType = data?.type;
    const deleteBlock = () => {
        if (!data.global && pbInst.isGlobalElem(getBlockElementById(data?.id))) {
            data.global = true;
        }
        pbInst.deleteBlock(data);
    }
    const handleCreateNewBlock = (newBType: TCromwellBlockType) =>
        pbInst.createNewBlock(newBType, data, bType === 'container' ? data : undefined);

    const blockProps: TBaseMenuProps = {
        block: block,
        isGlobalElem: pbInst.isGlobalElem,
        modifyData: (blockData: TCromwellBlockData) => {
            if (!blockData.global && pbInst.isGlobalElem(getBlockElementById(blockData?.id))) {
                blockData.global = true;
            }
            pbInst.modifyBlock(blockData);
            block?.rerender();
        },
        deleteBlock: deleteBlock,
        addNewBlockAfter: handleCreateNewBlock,
        plugins: pbInst.props.plugins,
        setCanDrag: (canDrag: boolean) => {
            if (!pbInst.blockInfos[bId]) pbInst.blockInfos[bId] = {};
            pbInst.blockInfos[bId].canDrag = canDrag;
        },
        setCanDeselect: (canDeselect: boolean) => {
            if (!pbInst.blockInfos[bId]) pbInst.blockInfos[bId] = {};
            pbInst.blockInfos[bId].canDeselect = canDeselect;
        },
    }
    return blockProps;
}