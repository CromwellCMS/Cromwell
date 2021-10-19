import { getStoreItem, setStoreItem } from '@cromwell/core';
import { createStyles, Switch, SwitchClassKey, SwitchProps, Theme, Tooltip } from '@mui/material';
import { withStyles } from '@mui/styles';
import clsx from 'clsx';
import React from 'react';

import styles from './ModeSwitch.module.scss';

interface Styles extends Partial<Record<SwitchClassKey, string>> {
    focusVisible?: string;
}

interface Props extends SwitchProps {
    classes: Styles;
}

export const ModeSwitch = withStyles((theme: Theme) =>
    createStyles({
        track: {
            backgroundImage: "url('/admin/static/sun.svg')",
            transition: theme.transitions.create(['background-color', 'border']),
        },
        switchBase: {
            '&$checked': {
                '& + $track': {
                    backgroundImage: 'url("/admin/static/night-mode.svg")',
                },
            }
        },
        checked: {},
    }),
)(({ classes, ...props }: Props) => {
    const darkMode = getStoreItem('theme')?.mode === 'dark';
    return (
        <Tooltip title="Switch theme">
            <Switch
                size="medium"
                checked={darkMode}
                onChange={() => {
                    setStoreItem('theme', {
                        ...(getStoreItem('theme') ?? {}),
                        mode: darkMode ? 'light' : 'dark',
                    });
                    window.localStorage.setItem('crw_theme_mode', darkMode ? 'light' : 'dark');
                    getStoreItem('forceUpdatePage')?.();
                }}
                focusVisibleClassName={classes.focusVisible}
                classes={{
                    root: styles.root,
                    switchBase: clsx(styles.switchBase, classes.switchBase),
                    thumb: styles.thumb,
                    track: clsx(styles.track, classes.track),
                    checked: clsx(styles.checked, classes.checked),
                }}
                {...props}
            />
        </Tooltip>
    );
});
