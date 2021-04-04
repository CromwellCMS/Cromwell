import {
    getStoreItem,
    setStoreItem,
    TCromwellBlock,
    TCromwellBlockData,
    TCromwellBlockType,
    TPageInfo,
    getRandStr,
} from '@cromwell/core';
import {
    BlockContentProvider,
    blockTypeToClassname,
    CContainer,
    CromwellBlockCSSclass,
    getBlockById,
    getBlockData,
    getBlockElementById,
    pageRootContainerId,
} from '@cromwell/core-frontend';
import React from 'react';

import PageErrorBoundary from '../../../components/errorBoundaries/PageErrorBoundary';
import { Draggable } from '../../../helpers/Draggable/Draggable';
import { IBaseMenu } from './blocks/BaseMenu';
import { ContainerBlock } from './blocks/ContainerBlock';
import { HTMLBlock } from './blocks/HTMLBlock';
import { PluginBlock } from './blocks/PluginBlock';
import { TextBlock } from './blocks/TextBlock';


export class PageBuilderView extends React.Component<{
    EditingPage: React.ComponentType<any>;
    editingPageInfo: TPageInfo;
    onPageModificationsChange: (modifications: TCromwellBlockData[] | null | undefined) => void;
}>  {

    private editorWindowRef: React.RefObject<HTMLDivElement> = React.createRef();
    private blockInstances: Record<string, IBaseMenu> = {};
    private ignoreDraggableClass: string = pageRootContainerId;
    private draggable: Draggable;

    componentDidMount() {

        const rootBlock = getBlockById(pageRootContainerId);

        if (rootBlock) rootBlock.addDidUpdateListener('PageBuilder', () => {
            this.updateDraggable();
        });

        this.init();
    }

    private async init() {
        this.draggable = new Draggable({
            draggableSelector: `.${CromwellBlockCSSclass}`,
            containerSelector: `.${blockTypeToClassname('container')}`,
            editorWindowElem: this.editorWindowRef.current,
            disableInsert: true,
            canInsertBlock: this.canInsertBlock,
            onBlockInserted: this.onBlockInserted,
            onBlockSelected: this.onDraggableBlockSelected,
            onBlockDeSelected: this.onDraggableBlockDeSelected,
            ignoreDraggableClass: this.ignoreDraggableClass,
            canDeselectBlock: this.canDeselectDraggableBlock,
            createFrame: true,
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
        };
        this._changedModifications = data;
    }


    private canInsertBlock = (container: HTMLElement, draggedBlock: HTMLElement, nextElement?: HTMLElement | null): boolean => {
        const parentData = getBlockData(container);
        if (!parentData?.id) {
            return false;
        }
        return true;
    }

    private onBlockInserted = async (container: HTMLElement, draggedBlock: HTMLElement, nextElement?: HTMLElement | null) => {

        const blockData = Object.assign({}, getBlockData(draggedBlock));
        const newParentData = Object.assign({}, getBlockData(container));
        const oldParentData = Object.assign({}, getBlockData(draggedBlock?.parentNode));
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

        const childrenData: TCromwellBlockData[] = this.addBlock({
            blockData,
            targetBlockData: nextData,
            parentEl: container,
            position: 'before'
        });

        // const blockPromise = this.rerenderBlock(blockData.id);
        // const newParentPromise = this.rerenderBlock(newParentData.id);
        // let oldParentPromise;
        // if (oldParentData?.id) oldParentPromise = this.rerenderBlock(oldParentData.id);
        // await Promise.all([blockPromise, newParentPromise, oldParentPromise]);

        await this.rerenderBlocks();

        this.draggable?.updateBlocks();
    }

    public updateDraggable = () => {
        this.draggable?.updateBlocks();
    }

    public modifyBlock = (blockData: TCromwellBlockData) => {
        if (!this.changedModifications) this.changedModifications = [];

        // Add to local changedModifications (contains only newly added changes);
        this.changedModifications = this.addToModifications(blockData, this.changedModifications);

        // Save to global modifcations in pageConfig.
        this.modifyBlockGlobally(blockData);
    }

    public deleteBlock = async (blockData: TCromwellBlockData) => {
        if (blockData) {
            blockData.isDeleted = true;
            this.modifyBlock(blockData);
        }

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

    /**
     * Save to global modifications in pageConfig
     * @param data 
     */
    private modifyBlockGlobally = (data: TCromwellBlockData) => {
        // Add to Store
        const pageConfig = getStoreItem('pageConfig');
        if (pageConfig) {
            pageConfig.modifications = this.addToModifications(data, pageConfig.modifications);
        };
        setStoreItem('pageConfig', pageConfig);
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
                if (inst?.rerender) promises.push(inst.rerender());
            })
        }
        await Promise.all(promises);
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
            this.onBlockDeSelected(blockData)
        }
    }

    private canDeselectDraggableBlock = (draggedBlock: HTMLElement): boolean => {
        const blockData = Object.assign({}, getBlockData(draggedBlock));
        if (blockData?.id) {
            return this.canDeselectBlock(blockData);
        }
        return true;
    }

    public addNewBlockAfter = async (afterBlockData: TCromwellBlockData, newBlockType: TCromwellBlockType) => {
        const newBlock: TCromwellBlockData = {
            id: `Editor_${this.props.editingPageInfo.route}_${getRandStr()}`,
            type: newBlockType,
            isVirtual: true,
        }
        this.addBlock({
            blockData: newBlock,
            targetBlockData: afterBlockData,
            position: 'after',
        });

        await this.rerenderBlocks();

        this.draggable?.updateBlocks();

        const el = getBlockElementById(newBlock.id);
        if (el) {
            // Select new block
            el.click();
        }
    }

    public addBlock = (config: {
        blockData: TCromwellBlockData;
        targetBlockData?: TCromwellBlockData;
        parentEl?: HTMLElement;
        position: 'before' | 'after';
    }): TCromwellBlockData[] => {
        const { targetBlockData, parentEl, position, blockData } = config;
        const parent = getBlockElementById(targetBlockData?.id)?.parentNode ?? parentEl;

        const parentData = getBlockData(parent);
        if (!parentData) return;

        const childrenData: TCromwellBlockData[] = [];

        let iteration = 0;
        let newBlockIndex = -1;

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

            this.modifyBlock(childData);
        });

        if (newBlockIndex === -1) {
            newBlockIndex = iteration;
            childrenData.push(blockData);
        }

        blockData.parentId = parentData.id;
        blockData.index = newBlockIndex;

        this.modifyBlock(blockData);

        return childrenData;
    }

    public onBlockSelected = (data: TCromwellBlockData) => {
        this.blockInstances[data.id]?.setMenuVisibility(true);
    }
    public onBlockDeSelected = (data: TCromwellBlockData) => {
        this.blockInstances[data.id]?.setMenuVisibility(false);
    }

    public handleSaveInst = (bId: string) => (inst: IBaseMenu) => {
        this.blockInstances[bId] = inst;
    }


    public canDeselectBlock = (data?: TCromwellBlockData) => {
        return this.blockInstances[data?.id]?.canDeselectBlock?.() ?? true;
    }

    render() {
        // console.log('PageBuilder render')
        const adminPanelProps = getStoreItem('pageConfig')?.adminPanelProps ?? {};

        const { EditingPage } = this.props;
        return (
            <div ref={this.editorWindowRef}>
                <BlockContentProvider
                    value={{
                        getter: (block) => {
                            // Will replace content inside any CromwellBlock by JSX this function returns

                            const data = block?.getData();
                            const bId = data?.id;
                            const bType = data?.type;
                            const deleteBlock = () => this.deleteBlock(data);

                            const handleAddNewBlockAfter = (newBType: TCromwellBlockType) =>
                                this.addNewBlockAfter(data, newBType);

                            const blockProps = {
                                saveMenuInst: this.handleSaveInst(bId),
                                block: block,
                                modifyData: this.modifyBlock,
                                deleteBlock: deleteBlock,
                                addNewBlockAfter: handleAddNewBlockAfter,
                            }

                            let content;

                            if (bType === 'text') {
                                content = <TextBlock
                                    {...blockProps}
                                />
                            }
                            if (bType === 'plugin') {
                                content = <PluginBlock
                                    {...blockProps}
                                />
                            }
                            if (bType === 'container') {
                                content = <ContainerBlock
                                    {...blockProps}
                                />
                            }
                            if (bType === 'HTML') {
                                content = <HTMLBlock
                                    {...blockProps}
                                />
                            }

                            if (content) {

                            } else {
                                content = block.getDefaultContent();
                            }

                            return <>
                                {content}
                            </>;
                        },
                        componentDidUpdate: () => {
                            this.draggable?.updateBlocks();

                            // Disable all links
                            const links = Array.from(this.editorWindowRef?.current?.getElementsByTagName('a') ?? []);
                            links.forEach(link => { link.onclick = (e) => { e.preventDefault() } })
                        }
                    }}
                >
                    <PageErrorBoundary>
                        <CContainer id={pageRootContainerId}
                            className={this.ignoreDraggableClass}
                            isConstant={true}
                        >
                            <EditingPage {...adminPanelProps} />
                        </CContainer>
                    </PageErrorBoundary>
                </BlockContentProvider>
            </div>
        )
    }

}
