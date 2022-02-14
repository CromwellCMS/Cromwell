import { ClickAwayListener, Fade, Popper as MuiPopper } from '@mui/material';
import React from 'react';

import { BasePopperProps } from '../../base/shared/Popper';

/** @internal */
export function Popper(props: BasePopperProps) {
  const onClose = () => {
    props.onClose?.();
  }
  return (
    <MuiPopper open={!!(props.open && props.children)}
      anchorEl={props.anchorEl}
      style={{ zIndex: 10000 }}
      transition
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          {/* ClickAwayListener directly inside Fade crashes the app, we need div wrapper */}
          <div>
            <ClickAwayListener onClickAway={onClose}>
              <div>{props.children}</div>
            </ClickAwayListener>
          </div>
        </Fade>
      )}
    </MuiPopper>
  )
}
