import React from 'react';

/** @internal */
export type TBaseTooltipProps = {
  open?: boolean;
  onOpen?: (event: React.SyntheticEvent) => void;
  enterDelay?: number;
  id?: string;
  leaveDelay?: number;
  onClose?: (event: React.SyntheticEvent | Event) => void;
  title: NonNullable<React.ReactNode>;
  className?: string;
  style?: React.CSSProperties;
  arrow?: boolean;
};
/** @internal */
export type TBaseTooltip = React.ComponentType<TBaseTooltipProps>;

/** @internal */
export const BaseTooltip: TBaseTooltip = (props) => {
  return <>{props.children}</>;
};
