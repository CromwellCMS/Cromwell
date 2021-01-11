import { getStoreItem, TCromwellBlockData, TCromwellBlockType, TPageInfo } from '@cromwell/core';
import {
    awaitBlocksRender,
    awaitImporter,
    BlockGetContentProvider,
    CContainer,
    getBlockById,
    pageRootContainerId,
} from '@cromwell/core-frontend';
import React from 'react';

import PageErrorBoundary from '../../../components/errorBoundaries/PageErrorBoundary';
import { IBaseMenu } from './blocks/BaseMenu';
import { ContainerBlock } from './blocks/ContainerBlock';
import { HTMLBlock } from './blocks/HTMLBlock';
import { PluginBlock } from './blocks/PluginBlock';
import { TextBlock } from './blocks/TextBlock';
import { PageBuilderController } from './PageBuilderController';


export class PageBuilderView extends React.Component<{
    EditingPage: React.ComponentType<any>;
    editingPageInfo: TPageInfo;
    onPageModificationsChange: (modifications: TCromwellBlockData[] | null | undefined) => void;
}>  {

    private pageBuilderController: PageBuilderController;
    private editorWindowRef: React.RefObject<HTMLDivElement> = React.createRef();
    private blockInstances: Record<string, IBaseMenu> = {};
    private ignoreDraggableClass: string = pageRootContainerId;

    componentDidMount() {

        const rootBlock = getBlockById(pageRootContainerId);

        if (rootBlock) rootBlock.addDidUpdateListener('PageBuilder', () => {
            this.pageBuilderController?.updateDraggable();
        });

        this.init();
    }

    private async init() {
        await new Promise(r => setTimeout(r, 50));
        await awaitImporter();
        await new Promise(r => setTimeout(r, 50));
        await awaitBlocksRender();
        await new Promise(r => setTimeout(r, 50));

        this.pageBuilderController = new PageBuilderController(
            this.props.onPageModificationsChange,
            this.editorWindowRef.current,
            this.onBlockSelected,
            this.onBlockDeSelected,
            this.ignoreDraggableClass,
            this.canDeselectBlock,
            this.props.editingPageInfo
        );
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

    public modifyBlock = (data: TCromwellBlockData) => {
        this.pageBuilderController?.modifyBlock(data);
    }

    public deleteBlock = (data?: TCromwellBlockData) => {
        if (data) this.pageBuilderController?.deleteBlock(data);
    }

    public canDeselectBlock = (data?: TCromwellBlockData) => {
        return this.blockInstances[data.id]?.canDeselectBlock?.() ?? true;
    }

    public addNewBlockAfter = (afterBlock: TCromwellBlockData, newBlockType: TCromwellBlockType) => {
        this.pageBuilderController.addNewBlockAfter(afterBlock, newBlockType);
    }

    render() {
        // console.log('PageBuilder render')
        const adminPanelProps = getStoreItem('pageConfig')?.adminPanelProps ?? {};

        const { EditingPage } = this.props;
        return (
            <div ref={this.editorWindowRef}>
                <BlockGetContentProvider
                    value={(block) => {
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

                        if (bType === 'text') {
                            return <TextBlock
                                {...blockProps}
                            />
                        }
                        if (bType === 'plugin') {
                            return <PluginBlock
                                {...blockProps}
                            />
                        }
                        if (bType === 'container') {
                            return <ContainerBlock
                                {...blockProps}
                            />
                        }
                        if (bType === 'HTML') {
                            return <HTMLBlock
                                {...blockProps}
                            />
                        }

                        return block.getDefaultContent();
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
                </BlockGetContentProvider>
            </div>
        )
    }

}
