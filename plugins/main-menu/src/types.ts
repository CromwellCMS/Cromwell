import React from 'react';

export type TMainMenuSettings = {
  items?: TMainMenuItem[];
  mobileBreakpoint?: number;
};

export type MenuItemTitleProps = {
  children?: React.ReactNode;
  menuItemTitleText?: string;
} & JSX.IntrinsicElements['div'];

export type TInstanceSettings = {
  mobile?: boolean;
  elements?: {
    MenuItemTitle?: React.ComponentType<MenuItemTitleProps>;
    IconButton?: React.ComponentType<{
      children?: React.ReactNode;
      onClick: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    }>;
    Popover?: React.ComponentType<{
      children?: React.ReactNode;
      id: string;
      open: boolean;
      anchorEl?: HTMLElement | null;
    }>;
  };
  classes?: {
    wrapper?: string;
    menuItem?: string;
    menuItemTitleContainer?: string;
    menuItemTitleText?: string;
  };
};

export type TMainMenuItem = {
  title: string;
  id: string;
  href?: string;
  html?: string;
  width?: number;
  sublinkCols?: number;
  sublinks?: {
    title?: string;
    href?: string;
  }[];
};
