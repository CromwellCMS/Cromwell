import { TPageInfo } from '@cromwell/core';
import { IconButton, MenuItem, Popover, TextField, Tooltip } from '@mui/material';
import {
    DeleteForever as DeleteForeverIcon,
    KeyboardArrowRight as KeyboardArrowRightIcon,
    Link as LinkIcon,
} from '@mui/icons-material';
import React, { useRef, useState } from 'react';

import { TExtendedPageInfo } from '../ThemeEdit';
import styles from './PageListItem.module.scss';

export const PageListItem = (props: {
    page: TExtendedPageInfo;
    activePage?: TPageInfo;
    handleOpenPage: (page: TPageInfo) => void;
    handleDeletePage: (page: TPageInfo) => void;
    onPreviewChange: (url: string) => any;
}) => {
    const { page, handleOpenPage, handleDeletePage, activePage } = props;
    const [editingPreview, setEditingPreview] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(page?.previewUrl ?? page?.route);
    const changeUrlBtn = useRef();
    const active = activePage && page && activePage.route === page.route && activePage.id === page.id;
    const isGeneric = page.route && (page.route.endsWith('[slug]') || page.route.endsWith('[id]'));

    const openEditingPreview = (event) => {
        event.stopPropagation();
        setEditingPreview(true)
    }
    const closeEditingPreview = (event) => {
        event.stopPropagation();
        setEditingPreview(false);
        props.onPreviewChange(previewUrl);
    }
    const handleChangeUrl = (val: string) => {
        const rootUrl = page.route.replace('[slug]', '').replace('[id]', '');
        if (!val) val = '';
        val = val.replace(rootUrl, '');
        val = val.replace(/\W/g, '-');
        val = rootUrl + val;
        setPreviewUrl(val);
    }

    if (!page) return null;

    return (
        <div ref={changeUrlBtn} onClick={e => e.stopPropagation()}>
            <MenuItem
                className={`${styles.pageItem} ${active ? styles.activeItem : ''}`}
                onClick={() => handleOpenPage(page)}
            >
                <p>{page.name}</p>
                <div className={styles.pageItemActions}>
                    {isGeneric && (
                        <>
                            <Tooltip title="Edit preview URL">
                                <IconButton
                                    onClick={openEditingPreview}
                                >
                                    <LinkIcon />
                                </IconButton>
                            </Tooltip>
                            <Popover open={editingPreview}
                                anchorEl={changeUrlBtn.current}
                                style={{ zIndex: 9999 }}
                                onClose={closeEditingPreview}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                elevation={5}
                            >
                                <div className={styles.previewChangeContainer} onClick={e => e.stopPropagation()}>
                                    <TextField
                                        onChange={(e) => handleChangeUrl(e.target.value)}
                                        fullWidth
                                        value={previewUrl ?? ''}
                                        className={styles.settingsInput}
                                        variant="standard"
                                        label="Preview URL" />
                                </div>
                            </Popover>
                        </>
                    )}
                    {page.isVirtual && (
                        <Tooltip title="Delete page">
                            <IconButton
                                aria-label="Delete page"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeletePage(page)
                                }}
                            >
                                <DeleteForeverIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                    <KeyboardArrowRightIcon className={styles.activeIcon} htmlColor="#fff" />
                </div>
            </MenuItem>
        </div>
    )
}
