import { TProductCategory } from '@cromwell/core';
import { Link } from '@cromwell/core-frontend';
import { withStyles } from '@mui/styles';
import React from 'react';

import { useAdapter } from '../../adapter';
import { HomeIcon } from '../icons';
import { getData } from './getData';

export function Breadcrumbs(props: {
  /**
   * data from getData function
   */
  data: TProductCategory[] | undefined;
}) {
  const { Breadcrumbs: MuiBreadcrumbs, Chip } = useAdapter();

  const StyledBreadcrumb = withStyles(() => ({
    root: {
      cursor: 'pointer',
      backgroundColor: 'rgba(0, 0, 0, 0.08)',
      height: '24px',
      color: '#424242',
      fontWeight: 400,
      '&:hover, &:focus': {
        backgroundColor: '#757575',
        color: '#fff',
      },
      '&:active': {
        boxShadow: ' 0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);',
        backgroundColor: '#757575',
        color: '#fff',
      },
    },
  }))(Chip) as typeof Chip;

  return (
    <MuiBreadcrumbs
      maxItems={5}
    >
      <Link href="/">
        <StyledBreadcrumb
          component="a"
          label="Home"
          icon={<HomeIcon style={{ width: '17px', height: '17px' }} fontSize="small" />}
        />
      </Link>
      {props.data?.map(crumb => {
        return (
          <Link
            key={crumb.id}
            href={`/category/${crumb.slug}`}>
            <StyledBreadcrumb
              label={crumb.name ?? ''}
              component="a"
            />
          </Link>
        )
      })}
    </MuiBreadcrumbs>
  )
}

Breadcrumbs.getData = getData;