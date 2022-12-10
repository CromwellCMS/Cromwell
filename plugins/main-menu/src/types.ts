import React from 'react';

export type TMainMenuSettings = {
  items?: TMainMenuItem[];
  mobileBreakpoint?: number;
};

export type TInstanceSettings = {
  mobile?: boolean;
  elements?: {
    MenuItem?: React.ComponentType<{ children?: React.ReactNode }>;
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
