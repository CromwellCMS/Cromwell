import { getStoreItem, setStoreItem, TCromwellBlockData } from '@cromwell/core';
import {
    CromwellBlockCSSclass, cromwellBlockTypeFromClassname,
    getBlockData, blockTypeToClassname, getBlockDyId
} from '@cromwell/core-frontend';

import { Draggable } from '../../../helpers/Draggable/Draggable';

export class PageBuilderService {

    private draggable: Draggable;
    
    constructor(
        private onPageModificationsChange: (modifications: TCromwellBlockData[] | null | undefined) => void,
        private editorWindow: HTMLElement | null = null,
        private onBlockSelected: (data: TCromwellBlockData) => void,
        private onBlockDeSelected: (data: TCromwellBlockData) => void,
        private ignoreDraggableClass: string | null = null,
        private canDeselectBlock: (data: TCromwellBlockData) => boolean,
    ) {
        this.draggable = new Draggable({
            draggableSelector: `.${CromwellBlockCSSclass}`,
            containerSelector: `.${blockTypeToClassname('container')}`,
            editorWindowElem: this.editorWindow,
            // disableInsert: true,
            canInsertBlock: this.canInsertBlock,
            onBlockInserted: this.onBlockInserted,
            onBlockSelected: this.onDraggableBlockSelected,
            onBlockDeSelected: this.onDraggableBlockDeSelected,
            ignoreDraggableClass: this.ignoreDraggableClass,
            canDeselectBlock: this.canDeselectDraggableBlock
        });
    }


    // Keeps track of modifications that user made (added) curently. Does not store all mods from actual pageCofig!
    // We need to send to the server only newly added modifications! 
    private _changedModifications: TCromwellBlockData[] | null | undefined = null;
    private get changedModifications(): TCromwellBlockData[] | null | undefined {
        return this._changedModifications;
    }
    private set changedModifications(data) {
        if (data) {
            this.onPageModificationsChange(data);
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

    private onBlockInserted = (container: HTMLElement, draggedBlock: HTMLElement, nextElement?: HTMLElement | null) => {

        const blockData = Object.assign({}, getBlockData(draggedBlock));
        const parentData = Object.assign({}, getBlockData(container));

        // Ivalid block - no id, or instance was not found in the global store.
        if (!blockData?.id) {
            console.error('!blockData.id: ', draggedBlock);
            return;
        }
        if (!parentData?.id) {
            console.error('!parentData.id: ', draggedBlock);
            return;
        }
        // console.log('onBlockInserted parentData.id', parentData.id, 'targetData.id', targetData.id, 'position', position)
        // console.log('blockData before', JSON.stringify(blockData, null, 2));


        // Set parent and index in parent's child array

        const childrenData: TCromwellBlockData[] = [];

        Array.from(container.children).forEach((child, i) => {
            const childData = Object.assign({}, getBlockData(child));
            if (childData.id) {
                if (child.classList.contains(this.draggable.cursorClass)) return;

                childData.index = i;
                childData.parentId = parentData.id;

                childrenData.push(childData)

                this.modifyBlock(childData);
            }
        })

        // console.log('blockData after', JSON.stringify(blockData, null, 2));

        // this.rerenderBlock(blockData.id);
        // childrenData.forEach(child => {
        //     this.rerenderBlock(child.id);
        // })
        // this.rerenderBlock(parentData.id);

        // Update Draggable blocks
        this.draggable?.updateBlocks();
    }



    public modifyBlock = (blockData: TCromwellBlockData) => {
        if (!this.changedModifications) this.changedModifications = [];

        // Add to local changedModifications (contains only newly added changes);
        this.changedModifications = this.addToModifications(blockData, this.changedModifications);

        // Save to global modifcations in pageConfig.
        this.modifyBlockGlobally(blockData);


        if (blockData.isDeleted) {
            const element = getBlockDyId(blockData.id);
            if (element) element.remove();
        }
    }

    public deleteBlock = (blockData: TCromwellBlockData) => {
        if (blockData) {
            blockData.isDeleted = true;
            this.modifyBlock(blockData);
        }
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

}

