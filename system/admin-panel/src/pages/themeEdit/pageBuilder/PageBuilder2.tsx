import {
    sleep,
    TCromwellBlock,
    TCromwellBlockData,
    TCromwellBlockType,
    TCromwellStore,
    TPageConfig,
    TPluginEntity,
} from '@cromwell/core';
import { BlockContentProvider, getBlockData, getBlockElementById } from '@cromwell/core-frontend';
import { Component } from 'react';

import PageErrorBoundary from '../../../components/errorBoundaries/PageErrorBoundary';
import { TBaseMenuProps } from './blocks/BaseMenu';
import { ContainerBlockReplacer } from './blocks/ContainerBlock';
import { GalleryBlockReplacer } from './blocks/GalleryBlock';
import { HTMLBlockReplacer } from './blocks/HTMLBlock';
import { ImageBlockReplacer } from './blocks/ImageBlock';
import { PluginBlockReplacer } from './blocks/PluginBlock';
import { TextBlockReplacer } from './blocks/TextBlock';
import styles from './PageBuilder.module.scss';

export class PageBuilder extends Component<{
    editingPageInfo: TPageConfig;
    EditingPage: React.ComponentType<any>;
    plugins: TPluginEntity[] | null;
    onPageModificationsChange: (modifications: TCromwellBlockData[] | null | undefined) => void;
}> {
    private adminReact: typeof import('react') = require('react');
    private editingFrameRef = this.adminReact.createRef<HTMLIFrameElement>();
    private contentWindow: Window;
    private contentStore: TCromwellStore;
    private contentReact: any;


    public blockInfos: Record<string, {
        canDrag?: boolean;
        canDeselect?: boolean;
    }> = {};

    componentDidMount() {
        this.init();
    }

    private createBlockProps = () => {

    }

    private init = async () => {
        if (!this.editingFrameRef.current) {
            console.error('!this.editingFrameRef.current');
            return;
        }
        await sleep(1);

        this.contentWindow = this.editingFrameRef.current.contentWindow;
        this.contentStore = this.contentWindow.CromwellStore;
        this.contentReact = this.contentStore.nodeModules?.modules?.['react'];

        this.contentStore.rendererComponents = {
            root: (props) => {
                const React = this.contentReact;
                console.log('rendererComponents')

                return (<div className={styles.editingPage}>
                    <BlockContentProvider
                        value={{
                            getter: (block) => {
                                console.log('BlockContentProvider block');
                                return <div>HELLO</div>;
                                // // Will replace content inside any CromwellBlock by JSX this function returns
                                // const data = block?.getData();
                                // const bType = data?.type;
                                // const blockProps = createBlockProps(this)(block);
                                // let content;

                                // if (bType === 'text') {
                                //     content = <TextBlockReplacer
                                //         {...blockProps}
                                //     />
                                // }
                                // if (bType === 'plugin') {
                                //     content = <PluginBlockReplacer
                                //         {...blockProps}
                                //     />
                                // }
                                // if (bType === 'container') {
                                //     content = <ContainerBlockReplacer
                                //         {...blockProps}
                                //     />
                                // }
                                // if (bType === 'HTML') {
                                //     content = <HTMLBlockReplacer
                                //         {...blockProps}
                                //     />
                                // }
                                // if (bType === 'image') {
                                //     content = <ImageBlockReplacer
                                //         {...blockProps}
                                //     />
                                // }
                                // if (bType === 'gallery') {
                                //     content = <GalleryBlockReplacer
                                //         {...blockProps}
                                //     />
                                // }

                                // if (!content) {
                                //     content = block.getDefaultContent();
                                // }

                                // return <>
                                //     {content}
                                // </>;
                            },
                        }}
                    >
                        <PageErrorBoundary>
                            {props.children}
                        </PageErrorBoundary>
                    </BlockContentProvider>
                </div>)
            }
        }

        this.contentStore.forceUpdatePage();
    }

    public deleteBlock = async (blockData: TCromwellBlockData) => {

    }

    public createNewBlock = async (newBlockType: TCromwellBlockType, afterBlockData: TCromwellBlockData, containerData?: TCromwellBlockData) => {

    }

    public modifyBlock = (blockData: TCromwellBlockData, saveHist?: boolean) => {

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

    render() {
        const { editingPageInfo } = this.props;
        const React = this.adminReact;

        return (
            <div>
                <iframe
                    className={styles.frameEditor}
                    src={`${window.location.origin}/${editingPageInfo.route}`}
                    ref={this.editingFrameRef}
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