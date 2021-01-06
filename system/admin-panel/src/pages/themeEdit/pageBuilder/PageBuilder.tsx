import { TCromwellBlockData } from '@cromwell/core';
import { BlockGetContentProvider } from '@cromwell/core-frontend';
import React from 'react';

import PageErrorBoundary from '../../../components/errorBoundaries/PageErrorBoundary';
import { BaseBlock } from './blocks/BaseBlock';
import { PageBuilderService } from './PageBuilderService';

const getRandStr = () => Math.random().toString(36).substring(2, 8) + Math.random().toString(36).substring(2, 8);


export class PageBuilder extends React.Component<{
    EditingPage: React.ComponentType<any>;
    onPageModificationsChange: (modifications: TCromwellBlockData[] | null | undefined) => void;
}>  {

    private pageBuilderService: PageBuilderService;
    private editorWindowRef: React.RefObject<HTMLDivElement> = React.createRef()
    private blockInstances: Record<string, BaseBlock> = {};

    componentDidMount() {

        this.pageBuilderService = new PageBuilderService(
            this.props.onPageModificationsChange,
            this.editorWindowRef,
            this.onBlockSelected,
            this.onBlockDeSelected,
        );
    }

    public onBlockSelected = (data: TCromwellBlockData) => {
        this.blockInstances[data.id]?.setMenuVisibility(true);
    }
    public onBlockDeSelected = (data: TCromwellBlockData) => {
        this.blockInstances[data.id]?.setMenuVisibility(false);
    }

    render() {
        const { EditingPage } = this.props;

        return (
            <div ref={this.editorWindowRef}>
                <BlockGetContentProvider value={(block) => {
                    const bType = block?.getData()?.type ?? block?.props?.type;
                    const bId = block?.getData()?.id ?? block?.props?.id;

                    let blockContent;

                    if (
                        bType === 'container'
                        || bType === 'HTML'
                        || bType === 'image'
                        || bType === 'list'
                        || bType === 'text'
                    ) {
                        blockContent = block.getDefaultContent();
                    }
                    if (bType === 'plugin') {
                        blockContent = (
                            <div>
                                <p>{block?.getData()?.plugin?.pluginName} Plugin</p>
                            </div>
                        )
                    }

                    return (
                        <BaseBlock
                            content={blockContent}
                            saveInst={(inst) => {
                                this.blockInstances[bId] = inst;
                            }}
                        />
                    )
                }}>
                    <PageErrorBoundary>
                        <EditingPage />
                    </PageErrorBoundary>
                </BlockGetContentProvider>
            </div>
        )
    }

}
