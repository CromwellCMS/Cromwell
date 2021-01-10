import { getStoreItem, TCromwellBlockData } from '@cromwell/core';
import { BlockGetContentProvider, CContainer } from '@cromwell/core-frontend';
import React from 'react';

import PageErrorBoundary from '../../../components/errorBoundaries/PageErrorBoundary';
import { PageBuilderService } from './PageBuilderService';
import { IBaseBlock } from './blocks/BaseBlock';
import { TextBlock } from './blocks/TextBlock';
import { PluginBlock } from './blocks/PluginBlock';
import { ContainerBlock } from './blocks/ContainerBlock';
import { HTMLBlock } from './blocks/HTMLBlock';

const getRandStr = () => Math.random().toString(36).substring(2, 8) + Math.random().toString(36).substring(2, 8);


export class PageBuilder extends React.Component<{
    EditingPage: React.ComponentType<any>;
    onPageModificationsChange: (modifications: TCromwellBlockData[] | null | undefined) => void;
}>  {

    private pageBuilderService: PageBuilderService;
    private editorWindowRef: React.RefObject<HTMLDivElement> = React.createRef();
    private blockInstances: Record<string, IBaseBlock> = {};
    private ignoreDraggableClass: string = 'page-root-container';

    componentDidMount() {

        setTimeout(() => {
            this.pageBuilderService = new PageBuilderService(
                this.props.onPageModificationsChange,
                this.editorWindowRef.current,
                this.onBlockSelected,
                this.onBlockDeSelected,
                this.ignoreDraggableClass,
                this.canDeselectBlock
            );
        }, 100);
    }

    public onBlockSelected = (data: TCromwellBlockData) => {
        this.blockInstances[data.id]?.setMenuVisibility(true);
    }
    public onBlockDeSelected = (data: TCromwellBlockData) => {
        this.blockInstances[data.id]?.setMenuVisibility(false);
    }

    public handleSaveInst = (bId: string) => (inst: IBaseBlock) => {
        this.blockInstances[bId] = inst;
    }

    public modifyBlock = (data: TCromwellBlockData) => {
        this.pageBuilderService?.modifyBlock(data);
    }

    public deleteBlock = (data?: TCromwellBlockData) => {
        if (data) this.pageBuilderService?.deleteBlock(data);
    }

    public canDeselectBlock = (data?: TCromwellBlockData) => {
        return this.blockInstances[data.id]?.canDeselectBlock?.() ?? true;
    }

    render() {
        // console.log('PageBuilder render')
        const pageCofig = getStoreItem('pageConfig')?.adminPanelProps ?? {};

        const { EditingPage } = this.props;
        return (
            <div ref={this.editorWindowRef}>
                <BlockGetContentProvider
                    value={(block) => {
                        const data = block?.getData();
                        const bId = data?.id ?? block?.props?.id;
                        const bType = data?.type ?? block?.props?.type;
                        const deleteBlock = () => this.deleteBlock(data);

                        if (bType === 'text') {
                            return <TextBlock
                                saveInst={this.handleSaveInst(bId)}
                                block={block}
                                modifyData={this.modifyBlock}
                                deleteBlock={deleteBlock}
                            />
                        }
                        if (bType === 'plugin') {
                            return <PluginBlock
                                saveInst={this.handleSaveInst(bId)}
                                block={block}
                                modifyData={this.modifyBlock}
                                deleteBlock={deleteBlock}
                            />
                        }
                        if (bType === 'container') {
                            return <ContainerBlock
                                saveInst={this.handleSaveInst(bId)}
                                block={block}
                                modifyData={this.modifyBlock}
                                deleteBlock={deleteBlock}
                            />
                        }
                        if (bType === 'HTML') {
                            return <HTMLBlock
                                saveInst={this.handleSaveInst(bId)}
                                block={block}
                                modifyData={this.modifyBlock}
                                deleteBlock={deleteBlock}
                            />
                        }

                        return block.getDefaultContent();
                    }}
                >
                    <PageErrorBoundary>
                        <CContainer id="page-root-container"
                            className={this.ignoreDraggableClass}
                            isConstant={true}
                        >
                            <EditingPage {...pageCofig} />
                        </CContainer>
                    </PageErrorBoundary>
                </BlockGetContentProvider>
            </div>
        )
    }

}
