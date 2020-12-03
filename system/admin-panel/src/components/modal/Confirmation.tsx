import React from 'react';
import {
    Modal,
    Button
} from '@material-ui/core';
import styles from './Confirmation.module.scss'
import commonStyles from '../../styles/common.module.scss';

export const ConfirmationModal = (props: {
    text: string;
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}) => {

    return (
        <Modal
            open={props.open}
            onClose={props.onClose}
            className={commonStyles.center}
        >
            <div className={styles.ConfirmationModal}>
                <p className={styles.text}>{props.text}</p>
                <div className={styles.actions}>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={props.onClose}
                        className={styles.actionBtn}
                    >Cancel</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={props.onConfirm}
                        className={styles.actionBtn}
                    >Ok</Button>
                </div>
            </div>
        </Modal>
    )
};