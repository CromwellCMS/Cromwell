import { TProductCategory } from '@cromwell/core';
import { Link } from '@cromwell/core-frontend';
import { Breadcrumbs as MuiBreadcrumbs, Chip, emphasize, Theme } from '@mui/material';
import { withStyles } from '@mui/styles';
import React from 'react';

import { HomeIcon } from '../../icons';


export default function Breadcrumbs(props: {
    breadcrumbs: TProductCategory[];
}) {
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
            {props.breadcrumbs?.map(crumb => {
                return (
                    <Link
                        key={crumb.id}
                        href={`/category/${crumb.slug}`}>
                        <StyledBreadcrumb
                            label={crumb.name}
                            component="a"
                        />
                    </Link>
                )
            })}
        </MuiBreadcrumbs>
    )
}


const StyledBreadcrumb = withStyles((theme: Theme) => ({
    root: {
        cursor: 'pointer',
        backgroundColor: theme.palette.grey[250],
        height: theme.spacing(3),
        color: theme.palette.grey[800],
        fontWeight: theme.typography.fontWeightRegular,
        '&:hover, &:focus': {
            backgroundColor: theme.palette.grey[600],
            color: '#fff',
        },
        '&:active': {
            boxShadow: theme.shadows[1],
            backgroundColor: emphasize(theme.palette.grey[600], 0.12),
            color: '#fff',
        },
    },
}))(Chip) as typeof Chip;