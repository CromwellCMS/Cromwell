import React from 'react';

import { TCmsConfig, TCmsSettings, TDefaultPageName, TPageConfig, TPageInfo, TPalette, TThemeConfig } from './data';

import type { GetStaticPropsResult, NextPage } from 'next';
import type { DocumentContext } from 'next/document';
import type { NextRouter } from 'next/router';

type ParsedUrlQuery = NodeJS.Dict<string | string[]>;

export type TStaticPageContext<Q extends ParsedUrlQuery = ParsedUrlQuery> = {
  params?: Q;
  preview?: boolean;
  previewData?: any;
  pageConfig?: TPageConfig;
  themeConfig?: TThemeConfig;
  userConfig?: TThemeConfig;
  cmsSettings?: TCmsConfig;
  themeCustomConfig?: any;
  pagesInfo?: TPageInfo[];
};

export type TGetStaticPropsResult<P> = GetStaticPropsResult<P> & {
  /**
   * Register extra plugins on a page without configuring them in `cromwell.config.js`
   * Note: every plugin on the page must be registered to get its settings server-side.
   */
  extraPlugins?: (TRegisteredPluginInfo | string)[];
};

export type TGetStaticProps<P = any, Q extends ParsedUrlQuery = ParsedUrlQuery> = (
  ctx: TStaticPageContext<Q>,
) => Promise<TGetStaticPropsResult<P>> | TGetStaticPropsResult<P>;

export type TStaticPagePluginContext<
  TPluginSettings = any,
  Q extends ParsedUrlQuery = ParsedUrlQuery,
> = TStaticPageContext<Q> & {
  // Plugin global settings
  pluginSettings?: TPluginSettings;
  // Local settings for every instance of a plugin at this page: { [pluginBlockId]: instanceSettings }
  pluginInstances?: Record<string, any>;
};

export type TGetPluginStaticProps<TResult = any, TPluginSettings = any, Q extends ParsedUrlQuery = ParsedUrlQuery> = (
  ctx: TStaticPagePluginContext<TPluginSettings, Q>,
) => Promise<TGetStaticPropsResult<TResult>> | TGetStaticPropsResult<TResult>;

export type TRegisteredPluginInfo = {
  pluginName: string;
  version?: string | null;
  globalSettings?: any | null;
  pluginInstances?: any | null;
};

export type TPageCmsProps = {
  documentContext?: TNextDocumentContext;
  router?: NextRouter;
  plugins?: Record<
    string,
    {
      data?: any;
      code?: string;
    }
  >;
  pageConfig?: TPageConfig | null;
  cmsSettings?: TCmsSettings | null;
  themeCustomConfig?: Record<string, any> | null;
  themeHeadHtml?: string | null;
  themeFooterHtml?: string | null;
  palette?: TPalette | null;
  defaultPages?: Partial<Record<TDefaultPageName, string>>;
  pageConfigRoute?: string;
  slug?: string | string[] | null;
  resolvedPageRoute?: string;
};

export type TCromwellPageCoreProps = { cmsProps: TPageCmsProps };

export type TCromwellPage<Props = Record<string, unknown> | undefined> = NextPage<Props & TCromwellPageCoreProps>;

export type TNextDocumentContext = Partial<DocumentContext> & {
  fullUrl?: string;
  origin?: string;
  cmsConfig?: TCmsConfig;
};

export type TCromwellBlock<TContentBlock = React.Component<TCromwellBlockProps>> = React.Component<
  TCromwellBlockProps<TContentBlock>
> & {
  getContentInstance: () => (React.Component & TContentBlock) | undefined;
  setContentInstance: (contentInstance: React.Component & TContentBlock) => void;
  getData: () => TCromwellBlockData | undefined;
  getBlockRef: () => React.RefObject<HTMLDivElement>;
  contentRender: (getContent?: TBlockContentProvider['getter'] | null) => React.ReactNode | null;
  consumerRender: (jsxParentId?: string) => JSX.Element | null;
  getDefaultContent: (setClasses?: (classes: string) => void) => React.ReactNode | null;
  notifyChildRegistered: (childInst: TCromwellBlock<any>) => void;
  rerender: () => Promise<void> | void;
  addDidUpdateListener: (id: string, func: () => void) => void;
  movedCompForceUpdate?: () => void;
  getInstanceId: () => string;
};

export type TDataComponentProps<Data> = {
  pluginName: string;
  component: React.ComponentType<Data>;
};

/**
 * Basic props for Blocks. Used in JSX by Theme authors
 */
export type TCromwellBlockProps<TContentBlock = React.Component> = {
  id: string;
  type?: TCromwellBlockType;
  /**
   * Get instance of this CBlock. For example:
   * <CList blockRef={(block) => { this.listInst = block }} />
   * ...
   * this.listInst.getContentInstance().openPage(1);
   */
  blockRef?: (block: TCromwellBlock<TContentBlock>) => void;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => any;
  jsxParentId?: string;
  content?: (
    data: TCromwellBlockData | undefined,
    blockRef: React.RefObject<HTMLDivElement>,
    setContentInstance: TCromwellBlock<TContentBlock>['setContentInstance'],
    setClasses?: (classes: string) => void,
  ) => React.ReactNode;
  children?: React.ReactNode;
} & TCromwellBlockData;

export type TContentComponentProps = {
  id: string;
  config?: TCromwellBlockData;
  children?: React.ReactNode;
};

export type TCromwellBlockType =
  | 'container'
  | 'plugin'
  | 'text'
  | 'HTML'
  | 'image'
  | 'gallery'
  | 'list'
  | 'editor'
  | 'link';

/**
 * Modification for a Block. Used in the Theme Editor to store user's changes.
 */
export type TCromwellBlockData = {
  /**
   * Component's id, must be unique in a page.
   */
  id: string;

  /**
   * Component's type
   */
  type?: TCromwellBlockType;

  /**
   *
   * If true, indicates that this Block was created in Theme Editor and it doesn't exist in source files as React component.
   * Exists only in page's config.
   */
  isVirtual?: boolean;

  /**
   * Id of Destination Component where this component will be displayed.
   */
  parentId?: string;

  /**
   * Index inside children array of parent element
   */
  index?: number;

  /** Styles applied from PageBuilder's UI */
  editorStyles?: {
    maxWidth?: number;
    offsetTop?: number;
    offsetBottom?: number;
    offsetLeft?: number;
    offsetRight?: number;
    align?: 'left' | 'right' | 'center';
  };

  /** CSS styles to apply to this block's wrapper */
  style?: string | React.CSSProperties;

  /**
   * Non-virtual blocks that exist in JSX cannot be deleted (or moved) in theme's source code by user
   * but user can set isDeleted flag that will tell Blocks to render null instead
   */
  isDeleted?: boolean;

  /** Persist on all pages, all inner modifications will be saved as global */
  global?: boolean;

  /** For plugin block */
  plugin?: {
    /** Plugin's name to render inside component. Same name must be in module.config.js */
    pluginName?: string;

    /** Plugin's local settings */
    instanceSettings?: Record<string, any>;

    /** Plugin's block name */
    blockName?: string;
  };

  /** For "image" block */
  image?: {
    src?: string;
    link?: string;
    withEffect?: boolean;
    alt?: string;
    objectFit?: 'contain' | 'cover';
    objectPosition?: string;
    width?: number | string;
    height?: number | string;
  };

  /** For "HTML" block */
  html?: {
    innerHTML?: string;
  };

  /** For gallery block */
  gallery?: TGallerySettings;

  /** For text block */
  text?: {
    content?: string;
    textElementType?: keyof React.ReactHTML;
    href?: string;
  };

  /** If true, user can't delete or modify this block in Theme editor */
  isConstant?: boolean;

  /** Hide this block in Theme editor */
  editorHidden?: boolean;

  /** For link block */
  link?: {
    href?: string;
    text?: string;
  };

  /** For editor block */
  editor?: {
    html?: string;
    data?: string;
  };
};

export type TImageSettings = {
  src: string;
  id?: string | number;
  href?: string;
  thumb?: string;
  alt?: string;
};

export type TGallerySettings = {
  responsive?: Record<number, TGallerySettings>;
  images?: TImageSettings[];
  slides?: React.ReactNode[];
  orientation?: 'horizontal' | 'vertical';
  loop?: boolean;
  height?: number;
  width?: number;
  lazy?: boolean;
  breakpoints?: any;
  /** ratio = width / height */
  ratio?: number;
  slideMaxWidth?: number;
  slideMinWidth?: number;
  autoHeight?: boolean;
  visibleSlides?: number;
  autoPlay?: boolean;
  speed?: number;
  interval?: number;
  effect?: 'slide' | 'fade' | 'cube' | 'coverflow' | 'flip';
  spaceBetween?: number;
  backgroundSize?: 'contain' | 'cover';
  navigation?:
    | {
        showOnHover?: boolean;
      }
    | boolean;
  pagination?: boolean;
  thumbs?:
    | boolean
    | {
        width?: number;
        height?: number;
        backgroundSize?: 'contain' | 'cover';
        loop?: boolean;
      };
  zoom?: boolean;
  fullscreen?: boolean;
  components?: {
    imgWrapper?: React.ComponentType<{ image?: TImageSettings; children?: React.ReactNode }>;
    backButton?: React.ComponentType;
    nextButton?: React.ComponentType;
  };
  classes?: {
    navBtn?: string;
    slide?: string;
    slideContainer?: string;
  };
};

export type TBlockContentProvider = {
  /** Will replace content inside any CromwellBlock by JSX this function returns */
  getter: (block: TCromwellBlock) => React.ReactNode | null;

  /** Additional CSS class to apply for block wrapper */
  blockClass?: string;

  /** Additional function to run in internal componentDidUpdate of any block */
  componentDidUpdate?: () => void;
};

export type TBlockStoreProvider = {
  instances: Record<string, TCromwellBlock | undefined>;
};
