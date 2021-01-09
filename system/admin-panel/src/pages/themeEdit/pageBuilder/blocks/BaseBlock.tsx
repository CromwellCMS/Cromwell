import { TCromwellBlock, TCromwellBlockData } from '@cromwell/core';
import { MenuItem, Tooltip } from '@material-ui/core';
import { DeleteForever as DeleteForeverIcon } from '@material-ui/icons';
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
}


export class BaseBlock<T = {}> extends React.Component<TBaseBlockProps & T, {
    menuVisible: boolean;
    isDeleted: boolean;
}> implements IBaseBlock {

    constructor(props) {
        super(props);

        this.state = {
            menuVisible: false,
            isDeleted: false
        }

        this.props.saveInst(this);
    }

    public setMenuVisibility = (menuVisible: boolean) => {
        this.setState({ menuVisible });
    }

    public deleteBlock = () => {
        this.props?.deleteBlock();
        this.setState({ isDeleted: true })
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
            <div className={styles.actions}>
                {this.props.icon}
                <Tooltip title="Delete block">
                    <MenuItem onClick={this.deleteBlock}>
                        <DeleteForeverIcon />
                    </MenuItem>
                </Tooltip>

            </div>
        );
        return <></>
    }
}