import React from 'react';

export type BasePopperProps = {
  open?: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
  anchorEl?: Element | null;
}

export function BasePopper(props: BasePopperProps) {
  return (
    <div style={{
      display: props?.open ? 'block' : 'none',
      position: 'absolute',
      zIndex: 100
    }}>
      {props.children}
    </div>
  )
}
