import React, { Suspense } from 'react';
import { Draggable } from '../../../helpers/Draggable/Draggable';
import { setStoreItem, getStoreItem, TCromwellBlockData, TPageConfig, TPageInfo } from '@cromwell/core';
import {
    CromwellBlockCSSclass, getRestAPIClient, cromwellBlockTypeFromClassname,
    getBlockDataById, cromwellIdFromHTML
} from '@cromwell/core-frontend';
import PageErrorBoundary from '../../errorBoundaries/PageErrorBoundary';
import LoadBox from '../../loadBox/LoadBox';

const getRandStr = () => Math.random().toString(36).substring(2, 8) + Math.random().toString(36).substring(2, 8);


export class PageBuilder extends React.Component<{
    EditingPage: React.LazyExoticComponent<React.ComponentType<any>>;
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
                    console.log('blockType', blockType);
                    if (blockType !== 'container') return false;
                }
                return true;
            },
            onBlockInserted: (draggedBlock: HTMLElement, targetBlock: HTMLElement,
                position: 'before' | 'after' | 'inside') => {
                // console.log('draggedBlock', draggedBlock);
                // console.log('targetBlock', targetBlock);
                const draggedBlockId = cromwellIdFromHTML(draggedBlock.id)
                const destinationComponentId = cromwellIdFromHTML(targetBlock.id);

                const blockData = Object.assign({}, getBlockDataById(draggedBlockId));

                // Ivalid block - no id, or instance was not found in the global store.
                if (!blockData.componentId) {
                    console.error('!blockData.componentId: ', draggedBlock);
                    return;
                }
                console.log('blockData before', blockData);

                // Cannot move near / inside itself
                if (destinationComponentId === draggedBlockId) return;

                // Cannot move into same position
                if (blockData.destinationPosition === position &&
                    blockData.destinationComponentId === destinationComponentId) return;


                // We cannot currently move non-virtual blocks because they have persisting 
                // JSX elements in files of the theme. We don't modify theme's files.
                // So here the workaround:
                if (!blockData.isVirtual) {
                    // 1. Create new virtual block copying current non-virtual with a new Id and new position
                    const virtualBlockData = Object.assign({}, blockData);
                    virtualBlockData.isVirtual = true;
                    virtualBlockData.componentId = virtualBlockData.componentId + '_' + getRandStr();
                    virtualBlockData.destinationPosition = position;
                    virtualBlockData.destinationComponentId = destinationComponentId;

                    // 2. Delete non-virtual block
                    blockData.isDeleted = true;

                    // 3. Save
                    this.modifyBlock(blockData);
                    this.modifyBlock(virtualBlockData);

                    console.log('blockData after blockData', blockData);
                    console.log('blockData after virtualBlockData', virtualBlockData);


                } else {
                    blockData.destinationPosition = position;
                    blockData.destinationComponentId = destinationComponentId;
                    this.modifyBlock(blockData);
                    console.log('blockData after', blockData);
                }

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
            if (mod.componentId === data.componentId) modIndex = i;
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
        // console.log('modifyBlockGlobally')
        // data.text = { content: '23234' };
        // Add to Store
        const pageConfig = getStoreItem('pageConfig');
        if (pageConfig) {
            pageConfig.modifications = this.addToModifications(data, pageConfig.modifications);
        };
        setStoreItem('pageConfig', pageConfig);

        // Re-render blocks
        const instances = getStoreItem('blockInstances');
        if (instances) {
            Object.values(instances).forEach(inst => {
                inst?.forceUpdate();
            })
        }
    }

    render() {
        const { EditingPage } = this.props;

        return (
            <div ref={this.editorWindowRef}>
                <PageErrorBoundary>
                    <Suspense fallback={<LoadBox />}>
                        <EditingPage />
                    </Suspense>
                </PageErrorBoundary>
            </div>
        )
    }

}
