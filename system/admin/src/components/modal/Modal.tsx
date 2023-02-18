import { Modal as MuiModal } from '@mui/material';
import clsx from 'clsx';
import React, { useEffect, useRef } from 'react';

import styles from './Modal.module.scss';

const Modal = (props: {
  children: React.ReactNode;
  open: boolean;
  onClose?: () => void;
  blurSelector?: string;
  className?: string;
  modalClassName?: string;
  disableEnforceFocus?: boolean;
}) => {
  const blurred = useRef(false);

  const setBlur = (blur: boolean) => {
    if (props.blurSelector) {
      const elem = document.querySelector(props.blurSelector) as HTMLElement;
      if (elem) {
        if (blur) {
          elem.style.filter = 'blur(4px)';
          blurred.current = true;
        } else {
          elem.style.filter = '';
          blurred.current = false;
        }
      }
    }
  };

  useEffect(() => {
    if (props.open) {
      setBlur(true);
    } else {
      setBlur(false);
    }
  }, [props.open]);

  useEffect(() => {
    return () => {
      if (blurred.current) {
        setBlur(false);
      }
    };
  }, []);

  return (
    <MuiModal
      disableEnforceFocus={props.disableEnforceFocus}
      open={props.open}
      onClose={props.onClose}
      className={clsx(styles.Modal, props.modalClassName)}
    >
      <div className={`${styles.modalContent} ${props.className ?? ''}`}>{props.children}</div>
    </MuiModal>
  );
};

export default Modal;
