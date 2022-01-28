import { TProductCategory } from '@cromwell/core';
import { Link } from '@cromwell/core-frontend';
import clsx from 'clsx';
import React from 'react';

import { useCategoryLink } from '../../helpers/useLinks';
import { BreadcrumbsProps } from './Breadcrumbs';
import styles from './Breadcrumbs.module.scss';
import { DefaultBreadcrumb } from './DefaultElements';

export const Crumb = (props: {
  crumb: TProductCategory;
  breadcrumbsProps: BreadcrumbsProps;
  icon?: JSX.Element;
  link?: string;
}) => {
  const BreadcrumbComp = props.breadcrumbsProps.elements?.Breadcrumb ?? DefaultBreadcrumb;
  const { crumb, breadcrumbsProps, icon } = props;
  const { classes } = breadcrumbsProps;
  const link = props.link ?? useCategoryLink(crumb, breadcrumbsProps.getBreadcrumbLink);

  return (
    <Link
      key={crumb.id}
      href={link}
      className={clsx(classes?.link)}
    >
      <BreadcrumbComp
        className={clsx(styles.breadcrumb, classes?.breadcrumb)}
        label={crumb.name ?? ''}
        icon={icon}
      />
    </Link>
  )
}
