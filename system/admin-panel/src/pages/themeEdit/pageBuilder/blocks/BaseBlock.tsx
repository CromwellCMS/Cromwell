import { TCromwellBlock, TCromwellBlockData } from '@cromwell/core';
import { MenuItem, Tooltip, IconButton, Popover, Typography } from '@material-ui/core';
import {
    DeleteForever as DeleteForeverIcon,
    AddCircleOutline as AddCircleOutlineIcon
} from '@material-ui/icons';
import React, { ReactNode } from 'react';
import styles from './BaseBlock.module.scss';

export type TBaseBlockProps = {
    saveInst: (inst: IBaseBlock) => void;
    block?: TCromwellBlock;
    modifyData?: (data: TCromwellBlockData) => void;
    deleteBlock?: () => void;
}

export interface IBaseBlock {
    setMenuVisibility: (menuVisible: boolean) => void
    deleteBlock?: () => void;
    canDeselectBlock?: () => boolean;
}


export class BaseBlock<T = {}> extends React.Component<TBaseBlockProps & T, {
    menuVisible: boolean;
    isDeleted: boolean;
    addNewOpen: boolean;
}> implements IBaseBlock {

    public addNewBtnEl: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();

    constructor(props) {
        super(props);

        this.state = {
            menuVisible: false,
            isDeleted: false,
            addNewOpen: false
        }

        this.props.saveInst(this);
    }

    public setMenuVisibility = (menuVisible: boolean) => {
        this.setState({ menuVisible, addNewOpen: false });
    }

    public deleteBlock = () => {
        this.props?.deleteBlock();
        this.setState({ isDeleted: true })
    }

    public handleCloseAddNew = () => {
        this.setState({ addNewOpen: false });
    }
    public handleOpenAddNew = () => {
        this.setState({ addNewOpen: true });
    }

    public canDeselectBlock = () => {
        return !this.state.addNewOpen;
    }

    public getBaseMenu = (icon?: JSX.Element) => {
        if (this.props?.block?.getData()?.isConstant) return <></>;

        return <BaseMenu
            saveInst={this.props.saveInst}
            block={this.props.block}
            modifyData={this.props.modifyData}
            deleteBlock={this.props.deleteBlock}
            icon={icon}
        />
    }

}

export class BaseMenu extends BaseBlock<{
    icon?: JSX.Element
}> {

    render() {
        if (this.state.menuVisible && !this.state.isDeleted) return (
            <>
                <div className={styles.actions}>
                    {this.props.icon}
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
                        open={this.state.addNewOpen}
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
                        <div>
                            
                        </div>
                    </Popover>
                </div>
            </>
        );
        return <></>
    }
}