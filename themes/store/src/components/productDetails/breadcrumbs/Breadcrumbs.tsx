import { TProductCategory } from '@cromwell/core';
import { Breadcrumbs as MuiBreadcrumbs, Chip, emphasize, Theme, withStyles } from '@material-ui/core';
import React from 'react';

import { HomeIcon } from '../../icons';


export default function Breadcrumbs(props: {
    breadcrumbs: TProductCategory[];
}) {
    return (
        <MuiBreadcrumbs
            maxItems={4}
        >
            <StyledBreadcrumb
                component="a"
                href="/"
                label="Home"
                icon={<HomeIcon fontSize="small" />}
            />
            {props.breadcrumbs?.map(crumb => {
                return (
                    <StyledBreadcrumb
                        label={crumb.name}
                        component="a"
                        href={`/category/${crumb.slug}`}
                        key={crumb.id}
                    />
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