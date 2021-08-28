import { TCromwellBlock } from '@cromwell/core';
import { Drawer, IconButton, Tooltip } from '@material-ui/core';
import { Close as CloseIcon, Redo as RedoIcon, Undo as UndoIcon } from '@material-ui/icons';
import React from 'react';

import { Draggable } from '../../../helpers/Draggable/Draggable';
import { ContainerBlockSidebar } from '../pageBuilder/blocks/ContainerBlock';
import { GalleryBlockSidebar } from '../pageBuilder/blocks/GalleryBlock';
import { HTMLBlockSidebar } from '../pageBuilder/blocks/HTMLBlock';
import { ImageBlockSidebar } from '../pageBuilder/blocks/ImageBlock';
import { PluginBlockSidebar } from '../pageBuilder/blocks/PluginBlock';
import { TextBlockSidebar } from '../pageBuilder/blocks/TextBlock';
import { TBlockMenuProps } from '../pageBuilder/blocks/BlockMenu';
import styles from './PageBuilderSidebar.module.scss';

type PageBuilderSidebarProps = {
    undoBtnRef: React.RefObject<HTMLButtonElement>
    undoModification: () => void;
    redoBtnRef: React.RefObject<HTMLButtonElement>
    redoModification: () => void;
    createBlockProps: (block: TCromwellBlock) => TBlockMenuProps;
    draggable?: Draggable;
    getInst: (menu: PageBuilderSidebar) => any;
    deselectBlock: (block: HTMLElement) => any;
}

export class PageBuilderSidebar extends React.Component<PageBuilderSidebarProps> {

    private selectedElement: HTMLElement;
    private selectedBlock: TCromwellBlock;

    constructor(props) {
        super(props);
        props.getInst(this);
    }

    public setSelectedBlock = (target: HTMLElement, block: TCromwellBlock) => {
        this.selectedElement = target;
        this.selectedBlock = block;
        this.forceUpdate();
    }

    private handleClose = () => {
        this.props.deselectBlock(this.selectedElement);
        this.selectedElement = undefined;
        this.selectedBlock = undefined;
        this.forceUpdate();
    }

    render() {
        const props = this.props;
        const block = this.selectedBlock;
        const data = block?.getData();
        const bType = data?.type;
        const blockProps = props.createBlockProps(block);

        let content;

        if (bType === 'text') {
            content = <TextBlockSidebar
                {...blockProps}
            />
        }
        if (bType === 'plugin') {
            content = <PluginBlockSidebar
                {...blockProps}
            />
        }
        if (bType === 'container') {
            content = <ContainerBlockSidebar
                {...blockProps}
            />
        }
        if (bType === 'HTML') {
            content = <HTMLBlockSidebar
                {...blockProps}
            />
        }
        if (bType === 'image') {
            content = <ImageBlockSidebar
                {...blockProps}
            />
        }
        if (bType === 'gallery') {
            content = <GalleryBlockSidebar
                {...blockProps}
            />
        }

        return (
            <Drawer
                classes={{ root: styles.sidebar, paper: styles.sidebarPaper }}
                variant="persistent"
                anchor={'left'}
                open={!!this.selectedBlock}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.actions}>
                    <div>
                        <Tooltip title="Undo">
                            <IconButton
                                ref={props.undoBtnRef}
                                onClick={props.undoModification}
                            >
                                <UndoIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Redo">
                            <IconButton
                                ref={props.redoBtnRef}
                                onClick={props.redoModification}
                            >
                                <RedoIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                    <div>
                        <Tooltip title="Close settings">
                            <IconButton
                                onClick={this.handleClose}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
                <div className={styles.settings}>
                    {content}
                </div>
            </Drawer>
        );
    }
}
