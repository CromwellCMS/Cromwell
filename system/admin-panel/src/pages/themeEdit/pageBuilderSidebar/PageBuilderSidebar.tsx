import { TCromwellBlock } from '@cromwell/core';
import { Drawer, IconButton, Tooltip } from '@material-ui/core';
import { Close as CloseIcon, Redo as RedoIcon, Undo as UndoIcon } from '@material-ui/icons';
import React, { useRef } from 'react';
import { connect, PropsType } from 'react-redux-ts';

import { Draggable } from '../../../helpers/Draggable/Draggable';
import { useForceUpdate } from '../../../helpers/forceUpdate';
import { TAppState } from '../../../redux/store';
import { ContainerBlockSidebar } from '../pageBuilder/blocks/ContainerBlock';
import { GalleryBlockSidebar } from '../pageBuilder/blocks/GalleryBlock';
import { HTMLBlockSidebar } from '../pageBuilder/blocks/HTMLBlock';
import { ImageBlockSidebar } from '../pageBuilder/blocks/ImageBlock';
import { PluginBlockSidebar } from '../pageBuilder/blocks/PluginBlock';
import { TextBlockSidebar } from '../pageBuilder/blocks/TextBlock';
import { TBaseMenuProps } from '../pageBuilder/blocks/BaseMenu';
import styles from './PageBuilderSidebar.module.scss';

type PageBuilderSidebarProps = {
    undoBtnRef: React.RefObject<HTMLButtonElement>
    undoModification: () => void;
    redoBtnRef: React.RefObject<HTMLButtonElement>
    redoModification: () => void;
    createBlockProps: (block: TCromwellBlock) => TBaseMenuProps;
    draggable?: Draggable;
}

const mapStateToProps = (state: TAppState) => {
    return {
        selectedBlock: state.selectedBlock,
        draggable: state.draggable,
    }
}
type TPropsType = PropsType<PropsType, PageBuilderSidebarProps,
    ReturnType<typeof mapStateToProps>>;

const PageBuilderSidebar = (props: TPropsType) => {
    const prevSelectedBlock = useRef<TCromwellBlock | undefined>();
    const open = useRef(false);
    const forceUpdate = useForceUpdate();

    if (props.selectedBlock !== prevSelectedBlock.current) {
        open.current = true;
        prevSelectedBlock.current = props.selectedBlock;
    }

    const block = props.selectedBlock;
    const handleClose = () => {
        prevSelectedBlock.current = undefined;
        open.current = false;
        props.setStateProp({
            prop: 'selectedBlock',
            payload: undefined,
        });
        props.draggable?.deselectCurrentBlock()
        forceUpdate();
    }

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
            open={open.current}
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
                            onClick={handleClose}
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

export default connect(mapStateToProps)(PageBuilderSidebar);
