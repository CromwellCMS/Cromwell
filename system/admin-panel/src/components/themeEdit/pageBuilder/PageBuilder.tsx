import { getStoreItem, setStoreItem, TCromwellBlockData } from '@cromwell/core';
import {
    BlockGetContentProvider,
    CromwellBlockCSSclass,
    cromwellBlockTypeFromClassname,
    getBlockData,
} from '@cromwell/core-frontend';
import React from 'react';

import { Draggable } from '../../../helpers/Draggable/Draggable';
import PageErrorBoundary from '../../errorBoundaries/PageErrorBoundary';

const getRandStr = () => Math.random().toString(36).substring(2, 8) + Math.random().toString(36).substring(2, 8);


export class PageBuilder extends React.Component<{
    EditingPage: React.ComponentType<any>;
    onPageModificationsChange: (modifications: TCromwellBlockData[] | null | undefined) => void;
}>  {
    private editorWindowRef: React.RefObject<HTMLDivElement> = React.createRef();

    private draggable: Draggable | null = null;

    // Keeps track of modifications that user made (added) curently. Does not store all mods from actual pageCofig!
    // We need to send to the server only newly added modifications! 
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

    componentDidMount() {

        this.draggable = new Draggable({
            draggableBlocksSelector: `.${CromwellBlockCSSclass}`,
            editorWindowElem: this.editorWindowRef.current ? this.editorWindowRef.current : undefined,
            hasToMoveElements: false,
            canInsertBlock: (draggedBlock: HTMLElement, targetBlock: HTMLElement,
                position: 'before' | 'after' | 'inside'): boolean => {
                // can insert inside only 'container' blocks
                if (position === 'inside') {
                    const blockType = cromwellBlockTypeFromClassname(targetBlock.classList.toString());
                    if (blockType !== 'container') return false;
                }
                const parentData = getBlockData(targetBlock.parentNode);
                if (!parentData?.id) {
                    return false;
                }

                return true;
            },
            onBlockInserted: (draggedBlock: HTMLElement, targetBlock: HTMLElement,
                position: 'before' | 'after' | 'inside') => {


                const blockData = Object.assign({}, getBlockData(draggedBlock));
                const parentData = getBlockData(targetBlock.parentNode)
                const targetData = getBlockData(targetBlock)

                // Ivalid block - no id, or instance was not found in the global store.
                if (!blockData?.id) {
                    console.error('!blockData.id: ', draggedBlock);
                    return;
                }
                if (!parentData?.id) {
                    console.error('!parentData.id: ', draggedBlock);
                    return;
                }
                if (!targetData?.id) {
                    console.error('!targetData.id: ', draggedBlock);
                    return;
                }
                // console.log('onBlockInserted parentData.id', parentData.id, 'targetData.id', targetData.id, 'position', position)
                // console.log('blockData before', JSON.stringify(blockData, null, 2));

                // Cannot move near / inside itself
                if (targetData.id === blockData.id) return;

                // Move block:
                // 1. Set Parent
                blockData.parentId = parentData.id;

                // 2. Set index in parent's child array

                let iteration = 0;
                const childrenData: TCromwellBlockData[] = [];
                Array.from(targetBlock.parentNode.children).forEach((child) => {
                    const childData = Object.assign({}, getBlockData(child));
                    if (childData.id) {
                        if (child.classList.contains(this.draggable.draggableShadowClass)) return;

                        childrenData.push(childData);
                        childData.parentId = parentData.id;

                        if (childData.id === targetData.id) {
                            if (position === 'before') {
                                blockData.index = iteration;
                                iteration++;
                                childData.index = iteration;
                            }
                            if (position === 'after') {
                                childData.index = iteration;
                                iteration++;
                                blockData.index = iteration;
                            }
                        } else {
                            childData.index = iteration;
                        }

                        this.modifyBlock(childData);

                        iteration++;
                    }
                })

                this.modifyBlock(blockData);

                // console.log('blockData after', JSON.stringify(blockData, null, 2));

                this.rerenderBlock(blockData.id);
                childrenData.forEach(child => {
                    this.rerenderBlock(child.id);
                })
                this.rerenderBlock(parentData.id);

                // Update Draggable blocks
                this.draggable?.updateBlocks();
            }
        });
    }

    private modifyBlock = (blockData: TCromwellBlockData) => {
        if (!this.changedModifications) this.changedModifications = [];

        // Add to local changedModifications (contains only newly added changes);
        this.changedModifications = this.addToModifications(blockData, this.changedModifications);

        // Save to global modifcations in pageConfig.
        this.modifyBlockGlobally(blockData);
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
        // data.text = { content: '23234' };
        // Add to Store
        const pageConfig = getStoreItem('pageConfig');
        if (pageConfig) {
            pageConfig.modifications = this.addToModifications(data, pageConfig.modifications);
        };
        setStoreItem('pageConfig', pageConfig);


    }

    private rerenderBlock(id: string) {
        // Re-render blocks
        const instances = getStoreItem('blockInstances');
        if (instances) {
            Object.values(instances).forEach(inst => {
                if (inst?.getData()?.id === id && inst?.forceUpdate)
                    inst.forceUpdate();
            })
        }
    }

    render() {
        const { EditingPage } = this.props;

        return (
            <div ref={this.editorWindowRef}>
                <BlockGetContentProvider value={(block) => {
                    const bType = block?.getData()?.type;
                    if (bType === 'container') {
                        return block.getDefaultContent();
                    }
                    if (bType === 'plugin') {
                        return (
                            <div>
                                <p>{block?.getData()?.plugin?.pluginName} Plugin</p>
                            </div>
                        )
                    }

                    return block.getDefaultContent();
                    // return (
                    //     <div>
                    //         <p>Block {block.getData().type}</p>
                    //     </div>
                    // )
                }}>
                    <PageErrorBoundary>
                        <EditingPage />
                    </PageErrorBoundary>
                </BlockGetContentProvider>
            </div>
        )
    }

}
