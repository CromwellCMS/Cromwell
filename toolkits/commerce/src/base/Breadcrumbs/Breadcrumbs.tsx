import { TGetStaticProps, TProductCategory } from '@cromwell/core';
import { CContainer, Link, usePagePropsContext } from '@cromwell/core-frontend';
import clsx from 'clsx';
import React from 'react';

import { removeUndefined } from '../../helpers/removeUndefined';
import { HomeIcon } from '../icons';
import styles from './Breadcrumbs.module.scss';
import { getData } from './getData';

type ServerSideData = TProductCategory[] | undefined | null;

type GetStaticPropsData = {
  'ccom_breadcrumbs'?: ServerSideData;
}


export type BreadcrumbProps = {
  /**
   * Override data by manually calling `getData` function and passing its result 
   */
  data?: TProductCategory[] | undefined;
  classes?: Partial<Record<'root' | 'wrapper' | 'breadcrumb' | 'link', string>>;
  style?: React.CSSProperties;
  maxItems?: number;
  elements?: BreadcrumbElements;
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
}

export function Breadcrumbs(props: BreadcrumbProps) {
  const { maxItems, classes, style, elements } = props;
  const pageProps = usePagePropsContext<GetStaticPropsData>();
  const data: ServerSideData = Object.assign({}, pageProps.pageProps?.ccom_breadcrumbs, props.data);

  const Wrapper = elements?.Wrapper ?? ((props) => (
    <div style={{ display: 'flex', ...(props.style ?? {}) }}
      className={props.className}
      id={props.id}
    >{props.children}</div>
  ));
  const Breadcrumb = elements?.Breadcrumb ?? ((props) => (
    <div style={props.style}
      className={props.className}
      id={props.id}
    >{props.icon} {props.label}</div>
  ));

  return (
    <CContainer id="ccom_breadcrumbs"
      className={clsx(styles.Breadcrumbs, classes?.root)}
      style={style}
    >
      <Wrapper maxItems={maxItems ?? 5}
        className={clsx(classes?.wrapper)}
      >
        <Link href="/">
          <Breadcrumb
            label="Home"
            key="/"
            className={clsx(styles.breadcrumb, classes?.breadcrumb)}
            icon={<HomeIcon style={{ width: '17px', height: '17px' }} fontSize="small" />}
          />
        </Link>
        {data?.map(crumb => {
          return (
            <Link
              key={crumb.id}
              href={`/category/${crumb.slug}`}
              className={clsx(classes?.link)}
            >
              <Breadcrumb
                className={clsx(styles.breadcrumb, classes?.breadcrumb)}
                label={crumb.name ?? ''}
              />
            </Link>
          )
        })}
      </Wrapper>
    </CContainer>
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
  const pageProps = usePagePropsContext<GetStaticPropsData>();
  return pageProps.pageProps?.ccom_breadcrumbs;
}
