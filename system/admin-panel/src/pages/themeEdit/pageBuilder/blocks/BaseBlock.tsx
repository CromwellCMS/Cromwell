import { MenuItem } from '@material-ui/core';
import { DeleteForever as DeleteForeverIcon, Edit as EditIcon } from '@material-ui/icons';
import React, { ReactNode } from 'react';

import styles from './BaseBlock.module.scss';

export class BaseBlock extends React.Component<{
    content: ReactNode;
    saveInst: (inst: BaseBlock) => void;
}, {
    menuVisible: boolean;
}> {

    constructor(props) {
        super(props);

        this.state = {
            menuVisible: false
        }
        this.props.saveInst(this);
    }

    public setMenuVisibility = (menuVisible: boolean) => {
        this.setState({ menuVisible });
    }

    render() {
        return (
            <>
                {this.state.menuVisible && (
                    <div className={styles.actions}>
                        <MenuItem onClick={() => {
                        }}>
                            <EditIcon />
                        </MenuItem>
                        <MenuItem>
                            <DeleteForeverIcon />
                        </MenuItem>
                    </div>
                )}
                {this.props.content}
            </>
        )
    }
}
