import React from 'react';

/** @internal */
export type BasePopperProps = {
  open?: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
  anchorEl?: Element | null;
};

/** @internal */
export function BasePopper(props: BasePopperProps) {
  if (!props?.open) return null;
  return (
    <div
      style={{
        position: 'absolute',
        zIndex: 100,
      }}
    >
      {props.children}
    </div>
  );
}
