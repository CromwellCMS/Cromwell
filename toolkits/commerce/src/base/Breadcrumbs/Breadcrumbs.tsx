import { TGetStaticProps, TProductCategory } from '@cromwell/core';
import { useAppPropsContext } from '@cromwell/core-frontend';
import clsx from 'clsx';
import React from 'react';

import { removeUndefined } from '../../helpers/removeUndefined';
import styles from './Breadcrumbs.module.scss';
import { Crumb } from './Crumb';
import { DefaultHomeIcon, DefaultWrapper } from './DefaultElements';
import { getData } from './getData';

export type ServerSideData = {
  categories?: TProductCategory[] | undefined;
} | undefined | null;

type GetStaticPropsData = {
  'ccom_breadcrumbs'?: ServerSideData;
}

export type BreadcrumbsProps = {
  classes?: Partial<Record<'root' | 'wrapper' | 'breadcrumb' | 'link', string>>;
  elements?: BreadcrumbElements;
  text?: {
    home?: string;
  }

  /**
   * Override data by manually calling `getData` function and passing its result 
   */
  data?: ServerSideData;

  /**
   * Max breadcrumb items. Currently is not implemented by base component. Can be implemented
   * by wrappers. Implemented by MuiBreadcrumbs.
   */
  maxItems?: number;

  /**
   * Show first breadcrumb as a link to home page `/`
   */
  showHome?: boolean;

  /**
   * Custom link resolver for each breadcrumb to category page.
   */
  getBreadcrumbLink?: (crumb: TProductCategory) => string | undefined;
}

export type BreadcrumbElements = {
  Wrapper?: React.ComponentType<{
    id?: string;
    className?: string;
    style?: React.CSSProperties;
    maxItems?: number;
  }>;
  Breadcrumb?: React.ComponentType<{
    className?: string;
    id?: string;
    label?: string;
    style?: React.CSSProperties;
    icon?: React.ReactNode | null;
    children?: React.ReactNode | null;
  }>;
  HomeIcon?: React.ComponentType;
}

/**
 * Represents breadcrumbs of categories on a product page.
 * 
 * - `withGetProps` - optional or use getData
 * - `getData` - available
 */
export function Breadcrumbs(props: BreadcrumbsProps) {
  const { maxItems, classes, elements, text, showHome } = props;
  const appProps = useAppPropsContext<GetStaticPropsData>();
  const data: ServerSideData = Object.assign({}, appProps.pageProps?.ccom_breadcrumbs, props.data);
  const Wrapper = elements?.Wrapper ?? DefaultWrapper;
  const HomeIcon = elements?.HomeIcon ?? DefaultHomeIcon;

  return (
    <Wrapper maxItems={maxItems ?? 5}
      className={clsx(styles.Breadcrumbs, classes?.root)}
    >
      {showHome && (
        <Crumb
          key="home"
          link={'/'}
          breadcrumbsProps={props}
          icon={<HomeIcon />}
          crumb={{
            id: 0,
            name: text?.home ?? "Home"
          }}
        />
      )}
      {data?.categories?.map(crumb => (
        <Crumb
          key={crumb.id}
          breadcrumbsProps={props}
          crumb={crumb}
        />
      ))}
    </Wrapper>
  )
}

Breadcrumbs.withGetProps = (originalGetProps?: TGetStaticProps) => {
  const getProps: TGetStaticProps<GetStaticPropsData> = async (context) => {
    const originProps = (await originalGetProps?.(context)) ?? {};
    const contextSlug = context?.params?.slug;
    const slug = (contextSlug && typeof contextSlug === 'string') && contextSlug || null;

    return {
      ...originProps,
      props: {
        ...(((originProps as any).props ?? {}) as Record<string, any>),
        ccom_breadcrumbs: removeUndefined(slug && await getData({ productSlug: slug })) || null,
      }
    }
  }

  return getProps;
}

Breadcrumbs.getData = getData;

Breadcrumbs.useData = (): ServerSideData | undefined => {
  const appProps = useAppPropsContext<GetStaticPropsData>();
  return appProps.pageProps?.ccom_breadcrumbs;
}
