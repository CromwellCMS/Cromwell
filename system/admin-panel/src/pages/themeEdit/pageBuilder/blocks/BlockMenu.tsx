import { TCromwellBlock, TCromwellBlockData, TCromwellBlockType, TPluginEntity } from '@cromwell/core';
import { Grid, IconButton, MenuItem, Popover, Tooltip } from '@mui/material';
import {
    AddCircleOutline as AddCircleOutlineIcon,
    Code as CodeIcon,
    DeleteForever as DeleteForeverIcon,
    EditOutlined as EditOutlinedIcon,
    Image as ImageIcon,
    PhotoLibrary as PhotoLibraryIcon,
    Subject as SubjectIcon,
    Widgets as WidgetsIcon,
} from '@mui/icons-material';
import React, { Component } from 'react';
import ReactDom from 'react-dom';

import { PluginIcon } from '../../../../constants/icons';
import styles from './BaseBlock.module.scss';

export type TBlockMenuProps = {
    block?: TCromwellBlock;
    global?: boolean,
    isGlobalElem: (block: HTMLElement) => boolean;
    getBlockElementById: (typeof import('@cromwell/core-frontend'))['getBlockElementById'];
    modifyData?: (data: TCromwellBlockData) => void;
    deleteBlock?: () => void;
    addNewBlockAfter?: (bType: TCromwellBlockType) => void;
    createBlockAfter?: (bType: TCromwellBlockType, pluginInfo?: { pluginName?: string; blockName?: string }) => void;
    icon?: JSX.Element;
    menuItems?: JSX.Element | JSX.Element[];
    settingsContent?: React.ReactNode;
    plugins: TPluginEntity[] | null;
    setCanDrag: (canDrag: boolean) => void;
    setCanDeselect: (canDeselect: boolean) => void;
    updateFramesPosition: () => any;
}

export class BlockMenu extends Component<{
    getInst: (menu: BlockMenu) => any;
    deselectBlock: (block: HTMLElement) => any;
    createBlockProps: (block: TCromwellBlock) => TBlockMenuProps;
}, {
    addNewOpen: boolean;
}> {
    private selectedFrame: HTMLElement;
    private selectedElement: HTMLElement;
    private selectedBlock: TCromwellBlock;
    private frameRef = React.createRef<HTMLDivElement>();
    public addNewBtnEl: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();

    constructor(props) {
        super(props);
        this.state = {
            addNewOpen: false,
        }

        props.getInst(this);
    }

    public setSelectedBlock = (frame: HTMLElement, blockElement: HTMLElement, block: TCromwellBlock) => {
        this.selectedFrame = frame;
        this.selectedElement = blockElement;
        this.selectedBlock = block;
        this.forceUpdate();
    }

    private handleClose = () => {
        this.props.deselectBlock(this.selectedElement);
        this.selectedElement = undefined;
        this.selectedBlock = undefined;
        this.forceUpdate();
    }

    public handleCloseAddNew = () => {
        this.setState({ addNewOpen: false });
    }

    public handleOpenAddNew = () => {
        this.setState({ addNewOpen: true });
    }

    render() {
        this.props.getInst(this);
        if (!this.selectedFrame) return <></>;

        const block = this.selectedBlock;
        const data = block?.getData();
        const bType = data?.type;
        const isConstant = data?.isConstant;
        const blockProps = this.props.createBlockProps(block);

        const addNewBlock = (bType: TCromwellBlockType) => () => {
            blockProps?.addNewBlockAfter?.(bType);
            this.setState({ addNewOpen: false });
        }

        let icon: JSX.Element;

        if (bType === 'text') {
            icon = <Tooltip title="Text block">
                <SubjectIcon />
            </Tooltip>
        }
        if (bType === 'plugin') {
            icon = <Tooltip title="Plugin block">
                <PluginIcon className={styles.customIcon} />
            </Tooltip>
        }
        if (bType === 'container') {
            icon = <Tooltip title="Container block">
                <WidgetsIcon />
            </Tooltip>
        }
        if (bType === 'HTML') {
            icon = <Tooltip title="HTML block">
                <CodeIcon />
            </Tooltip>
        }
        if (bType === 'image') {
            icon = <Tooltip title="Image block">
                <ImageIcon />
            </Tooltip>
        }
        if (bType === 'gallery') {
            icon = <Tooltip title="Gallery block">
                <PhotoLibraryIcon />
            </Tooltip>
        }
        if (bType === 'editor') {
            icon = <Tooltip title="Editor block">
                <EditOutlinedIcon />
            </Tooltip>
        }

        return ReactDom.createPortal(<>
            {!isConstant && (
                <div className={styles.actions}>
                    <div className={styles.typeIcon}>{icon}</div>
                    <Tooltip title="Delete block">
                        <MenuItem onClick={blockProps.deleteBlock}>
                            <DeleteForeverIcon />
                        </MenuItem>
                    </Tooltip>
                </div>
            )}
            <div className={styles.bottomActions} ref={this.addNewBtnEl}>
                <Tooltip title="Add block">
                    <IconButton onClick={this.handleOpenAddNew}>
                        <AddCircleOutlineIcon className={styles.addIcon} />
                    </IconButton>
                </Tooltip>
                <Popover
                    open={this.state.addNewOpen}
                    elevation={6}
                    anchorEl={this.addNewBtnEl.current}
                    onClose={this.handleCloseAddNew}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <div className={styles.widgetsContainer}>
                        <Grid container spacing={1} >
                            <Grid item xs={4} >
                                <MenuItem className={styles.widgetItem}
                                    onClick={addNewBlock('text')}
                                >
                                    <SubjectIcon />
                                    <p>Simple Text</p>
                                </MenuItem>
                            </Grid>
                            <Grid item xs={4} >
                                <MenuItem className={styles.widgetItem}
                                    onClick={addNewBlock('editor')}
                                >
                                    <EditOutlinedIcon />
                                    <p>Text Editor</p>
                                </MenuItem>
                            </Grid>
                            <Grid item xs={4} >
                                <MenuItem className={styles.widgetItem}
                                    onClick={addNewBlock('container')}
                                >
                                    <WidgetsIcon />
                                    <p>Container</p>
                                </MenuItem>
                            </Grid>
                            <Grid item xs={4} >
                                <MenuItem className={styles.widgetItem}
                                    onClick={addNewBlock('HTML')}
                                >
                                    <CodeIcon />
                                    <p>HTML</p>
                                </MenuItem>
                            </Grid>
                            <Grid item xs={4} >
                                <MenuItem className={styles.widgetItem}
                                    onClick={addNewBlock('plugin')}
                                >
                                    <PluginIcon className={styles.customIcon}
                                        style={{ filter: 'none' }} />
                                    <p>Plugin</p>
                                </MenuItem>
                            </Grid>
                            <Grid item xs={4} >
                                <MenuItem className={styles.widgetItem}
                                    onClick={addNewBlock('image')}
                                >
                                    <ImageIcon />
                                    <p>Image</p>
                                </MenuItem>
                            </Grid>
                            <Grid item xs={4} >
                                <MenuItem className={styles.widgetItem}
                                    onClick={addNewBlock('gallery')}
                                >
                                    <PhotoLibraryIcon />
                                    <p>Gallery</p>
                                </MenuItem>
                            </Grid>
                        </Grid>
                    </div>
                </Popover>
            </div>

        </>, this.selectedFrame)
    }
}
