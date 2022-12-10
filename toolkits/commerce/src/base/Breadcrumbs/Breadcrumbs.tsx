import { removeUndefined, TGetStaticProps, TProductCategory } from '@cromwell/core';
import { useAppPropsContext } from '@cromwell/core-frontend';
import clsx from 'clsx';
import React from 'react';

import styles from './Breadcrumbs.module.scss';
import { Crumb } from './Crumb';
import { DefaultHomeIcon, DefaultWrapper } from './DefaultElements';
import { breadcrumbsGetData } from './getData';

export type BreadcrumbsData =
  | {
      categories?: TProductCategory[] | undefined;
    }
  | undefined
  | null;

/** @internal */
type GetStaticPropsData = {
  ccom_breadcrumbs?: BreadcrumbsData;
};

export type BreadcrumbsProps = {
  classes?: Partial<Record<'root' | 'breadcrumb' | 'link', string>>;

  elements?: {
    Wrapper?: React.ComponentType<{
      id?: string;
      className?: string;
      style?: React.CSSProperties;
      maxItems?: number;
      children?: React.ReactNode;
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
  };

  text?: {
    home?: string;
  };

  /**
   * Override data by manually calling `getData` function and passing its result
   */
  data?: BreadcrumbsData;

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
};

/**
 * Represents breadcrumbs of categories on a product page.
 *
 * - `withGetProps` - optional or use getData
 * - `getData` - available
 * - `useData` - available
 */
export function Breadcrumbs(props: BreadcrumbsProps) {
  const { maxItems, classes, elements, text, showHome } = props;
  const appProps = useAppPropsContext<GetStaticPropsData>();
  const data: BreadcrumbsData = Object.assign({}, appProps.pageProps?.ccom_breadcrumbs, props.data);
  const Wrapper = elements?.Wrapper ?? DefaultWrapper;
  const HomeIcon = elements?.HomeIcon ?? DefaultHomeIcon;

  return (
    <Wrapper maxItems={maxItems ?? 5} className={clsx(styles.Breadcrumbs, classes?.root)}>
      {showHome && (
        <Crumb
          key="home"
          link={'/'}
          breadcrumbsProps={props}
          icon={<HomeIcon />}
          crumb={{
            id: 0,
            name: text?.home ?? 'Home',
          }}
        />
      )}
      {data?.categories?.map((crumb) => (
        <Crumb key={crumb.id} breadcrumbsProps={props} crumb={crumb} />
      ))}
    </Wrapper>
  );
}

/** @internal */
Breadcrumbs.withGetProps = (originalGetProps?: TGetStaticProps) => {
  const getProps: TGetStaticProps<GetStaticPropsData> = async (context) => {
    const originProps = (await originalGetProps?.(context)) ?? {};
    const contextSlug = context?.params?.slug;
    const slug = (contextSlug && typeof contextSlug === 'string' && contextSlug) || null;

    return {
      ...originProps,
      props: {
        ...(((originProps as any).props ?? {}) as Record<string, any>),
        ccom_breadcrumbs:
          removeUndefined(
            slug &&
              (await breadcrumbsGetData({ productSlug: slug }).catch((e) => {
                console.error('Breadcrumbs getData error: ', e);
                return null;
              })),
          ) || null,
      },
    };
  };

  return getProps;
};

/** @internal */
Breadcrumbs.getData = (opts) => breadcrumbsGetData(opts);

/** @internal */
Breadcrumbs.useData = (): BreadcrumbsData => {
  const appProps = useAppPropsContext<GetStaticPropsData>();
  return appProps.pageProps?.ccom_breadcrumbs;
};
