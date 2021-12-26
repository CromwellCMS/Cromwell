import { TProductCategory } from '@cromwell/core';
import { Link, CContainer } from '@cromwell/core-frontend';
import clsx from 'clsx';
import React from 'react';

import { HomeIcon } from '../icons';
import styles from './Breadcrumbs.module.scss';
import { getData } from './getData';

export type BreadcrumbProps = {
  /**
   * data from getData function
   */
  data: TProductCategory[] | undefined;
  className?: string;
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
  const { maxItems, className, style, data, elements } = props;
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
      className={clsx(styles.Breadcrumbs, className)}
      style={style}
    >
      <Wrapper maxItems={maxItems ?? 5}>
        <Link href="/">
          <Breadcrumb
            label="Home"
            key="/"
            className={styles.breadcrumb}
            icon={<HomeIcon style={{ width: '17px', height: '17px' }} fontSize="small" />}
          />
        </Link>
        {data?.map(crumb => {
          return (
            <Link
              key={crumb.id}
              href={`/category/${crumb.slug}`}>
              <Breadcrumb
                className={styles.breadcrumb}
                label={crumb.name ?? ''}
              />
            </Link>
          )
        })}
      </Wrapper>
    </CContainer>
  )
}

Breadcrumbs.getData = getData;