import React from 'react';

/** @internal */
export type TBaseAlertProps = {
  severity?: 'success' | 'info' | 'warning' | 'error';
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};
/** @internal */
export type TBaseAlert = React.ComponentType<TBaseAlertProps>;

/** @internal */
export const BaseAlert: TBaseAlert = (props) => {
  return (
    <div className={props.className} style={props.style} id={props.id}>
      {props.children}
    </div>
  );
};
