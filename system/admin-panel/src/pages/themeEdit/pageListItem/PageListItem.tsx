import { TPageInfo } from '@cromwell/core';
import { IconButton, MenuItem, Tooltip } from '@material-ui/core';
import {
    Settings as SettingsIcon, FormatPaint as FormatPaintIcon,
    DeleteForever as DeleteForeverIcon,
} from '@material-ui/icons';
import React from 'react';

import styles from './PageListItem.module.scss';

export const PageListItem = (props: {
    page: TPageInfo;
    // handleOpenPageSettings: (page: TPageInfo) => void;
    handleOpenPage: (page: TPageInfo) => void;
    handleDeletePage: (page: TPageInfo) => void;
}) => {
    const { page, handleOpenPage, handleDeletePage } = props;
    return (
        <MenuItem
            className={styles.pageItem}
            onClick={() => handleOpenPage(page)}
        >
            <p>{page.name}</p>
            <div className={styles.pageItemActions}>
                {/* <Tooltip title="Edit page settings">
                    <IconButton
                        aria-label="Edit page settings"
                        onClick={() => handleOpenPageSettings(page)}
                    >
                        <SettingsIcon />
                    </IconButton>
                </Tooltip> */}
                {/* <Tooltip title="Delete page">
                    <IconButton
                        aria-label="Delete page"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePage(page)
                        }}
                    >
                        <DeleteForeverIcon />
                    </IconButton>
                </Tooltip> */}
                {/* <IconButton
                    aria-label="Open page builder"
                // onClick={() => handleOpenPageBuilder(page)}
                >
                    <SettingsIcon />
                </IconButton> */}
            </div>
        </MenuItem>
    )
}
