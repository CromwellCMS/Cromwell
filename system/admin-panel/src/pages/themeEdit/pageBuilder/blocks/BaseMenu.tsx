import { TCromwellBlock, TCromwellBlockData, TCromwellBlockType, TPluginEntity } from '@cromwell/core';
import { Grid, IconButton, MenuItem, Popover, Tooltip } from '@material-ui/core';
import {
    AddCircleOutline as AddCircleOutlineIcon,
    Code as CodeIcon,
    DeleteForever as DeleteForeverIcon,
    Image as ImageIcon,
    PhotoLibrary as PhotoLibraryIcon,
    Power as PowerIcon,
    Settings as SettingsIcon,
    Subject as SubjectIcon,
    Widgets as WidgetsIcon,
} from '@material-ui/icons';
import React from 'react';

import styles from './BaseBlock.module.scss';

export type TBaseMenuProps = {
    saveMenuInst: (inst: IBaseMenu) => void;
    block?: TCromwellBlock;
    modifyData?: (data: TCromwellBlockData) => void;
    deleteBlock?: () => void;
    addNewBlockAfter?: (bType: TCromwellBlockType) => void;
    icon?: JSX.Element;
    menuItems?: JSX.Element | JSX.Element[];
    settingsContent?: React.ReactNode;
    plugins: TPluginEntity[] | null;
    setCanDrag: (canDrag: boolean) => void;
    setCanDeselect: (canDeselect: boolean) => void;
}

export interface IBaseMenu {
    setMenuVisibility: (menuVisible: boolean) => void
    deleteBlock?: () => void;
    canDeselectBlock?: () => boolean;
}

export class BaseMenu extends React.Component<TBaseMenuProps, {
    menuVisible: boolean;
    isDeleted: boolean;
    addNewOpen: boolean;
    settingsOpen: boolean;
}> implements IBaseMenu {

    public addNewBtnEl: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();

    constructor(props) {
        super(props);

        this.state = {
            menuVisible: false,
            isDeleted: false,
            addNewOpen: false,
            settingsOpen: false,
        }

        this.props.saveMenuInst(this);
    }

    public addNewBlock = (bType: TCromwellBlockType) => () => {
        this.props?.addNewBlockAfter?.(bType);
        this.setState({ menuVisible: false, addNewOpen: false, settingsOpen: false });
    }

    public setMenuVisibility = (menuVisible: boolean) => {
        this.setState({ menuVisible, addNewOpen: false, settingsOpen: false });
    }

    public deleteBlock = () => {
        this.props?.deleteBlock();
        this.setState({ isDeleted: true });
    }

    public handleCloseAddNew = () => {
        this.setState({ addNewOpen: false });
    }
    public handleOpenAddNew = () => {
        this.setState({ addNewOpen: true });
    }

    public canDeselectBlock = () => {
        return !this.state.addNewOpen && !this.state.settingsOpen;
    }

    public handleOpenSettings = () => {
        this.setState({ settingsOpen: true });
    }

    public handleCloseSettings = () => {
        this.setState({ settingsOpen: false });
    }

    render() {
        if (this.props?.block?.getData()?.isConstant) return <></>;

        if (this.state.menuVisible && !this.state.isDeleted) return (
            <div className={styles.menu}>
                <div className={styles.actions}>
                    {this.props.icon}
                    {this.props.menuItems}
                    {this.props.settingsContent && (
                        <Tooltip title="Settings">
                            <MenuItem onClick={this.handleOpenSettings}>
                                <SettingsIcon />
                            </MenuItem>
                        </Tooltip>
                    )}
                    <Tooltip title="Delete block">
                        <MenuItem onClick={this.deleteBlock}>
                            <DeleteForeverIcon />
                        </MenuItem>
                    </Tooltip>
                </div>
                <div className={styles.bottomActions} ref={this.addNewBtnEl}>
                    <Tooltip title="Add block">
                        <IconButton onClick={this.handleOpenAddNew}>
                            <AddCircleOutlineIcon className={styles.addIcon} />
                        </IconButton>
                    </Tooltip>
                    <Popover
                        open={this.state.settingsOpen}
                        elevation={6}
                        anchorEl={this.addNewBtnEl.current}
                        onClose={this.handleCloseSettings}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                    >
                        <div className={styles.settingsContent}>
                            {this.props.settingsContent}
                        </div>
                    </Popover>
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
                                        onClick={this.addNewBlock('text')}
                                    >
                                        <SubjectIcon />
                                        <p>Text</p>
                                    </MenuItem>
                                </Grid>
                                <Grid item xs={4} >
                                    <MenuItem className={styles.widgetItem}
                                        onClick={this.addNewBlock('container')}
                                    >
                                        <WidgetsIcon />
                                        <p>Container</p>
                                    </MenuItem>
                                </Grid>
                                <Grid item xs={4} >
                                    <MenuItem className={styles.widgetItem}
                                        onClick={this.addNewBlock('HTML')}
                                    >
                                        <CodeIcon />
                                        <p>HTML</p>
                                    </MenuItem>
                                </Grid>
                                <Grid item xs={4} >
                                    <MenuItem className={styles.widgetItem}
                                        onClick={this.addNewBlock('plugin')}
                                    >
                                        <PowerIcon />
                                        <p>Plugin</p>
                                    </MenuItem>
                                </Grid>
                                <Grid item xs={4} >
                                    <MenuItem className={styles.widgetItem}
                                        onClick={this.addNewBlock('image')}
                                    >
                                        <ImageIcon />
                                        <p>Image</p>
                                    </MenuItem>
                                </Grid>
                                <Grid item xs={4} >
                                    <MenuItem className={styles.widgetItem}
                                        onClick={this.addNewBlock('gallery')}
                                    >
                                        <PhotoLibraryIcon />
                                        <p>Gallery</p>
                                    </MenuItem>
                                </Grid>
                            </Grid>
                        </div>
                    </Popover>
                </div>
            </div>
        );
        return <></>
    }
}