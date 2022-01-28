import clsx from 'clsx';
import React from 'react';

import { HomeIcon } from '../icons';
import styles from './Breadcrumbs.module.scss';

export const DefaultBreadcrumb = ((props) => (
  <div style={props.style}
    className={clsx(props.className, styles.defaultBreadcrumb)}
    id={props.id}
  >{props.icon} {props.label}</div>
));

export const DefaultWrapper = ((props) => (
  <div style={{ display: 'flex', ...(props.style ?? {}) }}
    className={props.className}
    id={props.id}
  >{props.children}</div>
));

export const DefaultHomeIcon = () =>
  <HomeIcon style={{ width: '17px', height: '17px', marginLeft: '6px' }} fontSize="small" />;