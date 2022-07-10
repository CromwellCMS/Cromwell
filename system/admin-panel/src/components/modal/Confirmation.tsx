import React from 'react';

import commonStyles from '../../styles/common.module.scss';
import styles from './Confirmation.module.scss';
import { TextButton } from '../buttons/TextButton';
import Modal from './Modal';

const ConfirmationModal = (props: {
    title: string;
    open: boolean;
    onClose?: () => void;
    onConfirm?: () => void;
    disabled?: boolean;
}) => {

    return (
        <Modal
            open={props.open}
            onClose={() => !props.disabled ? props.onClose() : ''}
            className={commonStyles.center}
            blurSelector="#root"
        >
            <div className={styles.ConfirmationModal}>
                <p className={styles.text}>{props.title}</p>
                <div className={styles.actions}>
                    <TextButton
                        role="button"
                        variant="outlined"
                        onClick={props.onClose}
                        className={styles.actionBtn}
                        disabled={props.disabled}
                    >Cancel</TextButton>
                    <TextButton
                        role="button"
                        onClick={props.onConfirm}
                        className={styles.actionBtn}
                        disabled={props.disabled}
                    >Ok</TextButton>
                </div>
            </div>
        </Modal>
    )
};

export default ConfirmationModal;

export const modalStyles = styles;


let confirmPromptInst: ConfirmPrompt | undefined;

export class ConfirmPrompt extends React.Component<any, {
    open: boolean;
    title?: string;
}> {

    private confirmResolve: (val: boolean) => any;

    constructor(props) {
        super(props);
        confirmPromptInst = this;
    }

    public askConfirm = (title?: string) => {
        this.setState({
            open: true,
            title
        });

        const confirmPromise = new Promise<boolean>(done => {
            this.confirmResolve = done;
        })

        return confirmPromise;
    }

    public confirmInput = (agree: boolean) => {
        this.confirmResolve?.(agree);
        this.setState({
            open: false,
            title: undefined,
        });
    }

    render() {
        return (
            <ConfirmationModal
                title={this.state?.title ?? ''}
                open={this.state?.open ?? false}
                onClose={() => this.confirmInput(false)}
                onConfirm={() => this.confirmInput(true)}
            />
        )
    }
}

export const askConfirmation = async (options?: {
    title?: string;
}): Promise<boolean> => {
    return confirmPromptInst?.askConfirm(options?.title) ?? false;
}