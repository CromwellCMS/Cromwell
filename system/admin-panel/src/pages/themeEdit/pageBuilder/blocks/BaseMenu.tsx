import { TCromwellBlock, TCromwellBlockData, TCromwellBlockType, TPluginEntity } from '@cromwell/core';
import { getBlockElementById } from '@cromwell/core-frontend';
import { Grid, IconButton, MenuItem, Popover, Tooltip } from '@material-ui/core';
import {
    AddCircleOutline as AddCircleOutlineIcon,
    Code as CodeIcon,
    DeleteForever as DeleteForeverIcon,
    Image as ImageIcon,
    PhotoLibrary as PhotoLibraryIcon,
    Power as PowerIcon,
    Public as PublicIcon,
    Subject as SubjectIcon,
    Widgets as WidgetsIcon,
} from '@material-ui/icons';
import React from 'react';
import { connect, PropsType } from 'react-redux-ts';

import { TAppState } from '../../../../redux/store';
import styles from './BaseBlock.module.scss';

export type TBaseMenuProps = {
    block?: TCromwellBlock;
    global?: boolean,
    isGlobalElem: (block: HTMLElement) => boolean;
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

const mapStateToProps = (state: TAppState) => {
    return {
        selectedBlock: state.selectedBlock,
    }
}
type TPropsType = PropsType<PropsType, TBaseMenuProps,
    ReturnType<typeof mapStateToProps>>;

class BaseMenuComp extends React.Component<TPropsType, {
    addNewOpen: boolean;
}>  {

    public addNewBtnEl: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();

    constructor(props) {
        super(props);

        this.state = {
            addNewOpen: false,
        }
    }

    public addNewBlock = (bType: TCromwellBlockType) => () => {
        this.props?.addNewBlockAfter?.(bType);
        this.setState({ addNewOpen: false });
    }

    public deleteBlock = () => {
        this.props?.deleteBlock();
    }

    public handleCloseAddNew = () => {
        this.setState({ addNewOpen: false });
    }
    public handleOpenAddNew = () => {
        this.setState({ addNewOpen: true });
    }

    render() {
        const data = this.props?.block?.getData();
        const isConstant = data?.isConstant;
        const menuVisible = this.props.selectedBlock?.getData()?.id === data?.id;
        if (!menuVisible) return <></>

        return (
            <div className={styles.menu}>
                {!isConstant && (
                    <div className={styles.actions}>
                        <div className={styles.typeIcon}>{this.props.icon}</div>
                        {this.props.menuItems}
                        <Tooltip title="Delete block">
                            <MenuItem onClick={this.deleteBlock}>
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
    }
}

export const BaseMenu = connect(mapStateToProps)(BaseMenuComp);
