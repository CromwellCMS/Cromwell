import { getStoreItem, setStoreItem } from '@cromwell/core';
import { Switch, SwitchClassKey, SwitchProps, Theme, Tooltip } from '@mui/material';
import { createStyles, withStyles } from '@mui/styles';
import clsx from 'clsx';
import React from 'react';

import styles from './ModeSwitch.module.scss';

interface Styles extends Partial<Record<SwitchClassKey, string>> {
  focusVisible?: string;
}

interface Props extends SwitchProps {
  classes: Styles;
}

export const ModeSwitch = withStyles((theme: Theme | undefined) =>
  createStyles({
    track: {
      backgroundImage: "url('/admin/static/sun.svg')",
      transition: theme?.transitions?.create(['background-color', 'border']),
    },
    switchBase: {
      '&$checked': {
        '& + $track': {
          backgroundImage: 'url("/admin/static/night-mode.svg")',
        },
      },
    },
    checked: {},
  }),
)(
  ({
    classes,
    ...props
  }: Props & {
    onToggle: () => void;
    value: 'light' | 'dark';
  }) => {
    return (
      <div className={props.value === 'dark' ? styles.darkMode : ''}>
        <Tooltip title={props.value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
          <Switch
            size="medium"
            checked={props.value === 'dark'}
            onChange={props.onToggle}
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
      </div>
    );
  },
);

export const AdminModeSwitch = () => {
  const darkMode = getStoreItem('theme')?.mode === 'dark';
  return (
    <ModeSwitch
      value={darkMode ? 'dark' : 'light'}
      onToggle={() => {
        setStoreItem('theme', {
          ...(getStoreItem('theme') ?? {}),
          mode: darkMode ? 'light' : 'dark',
        });
        window.localStorage.setItem('crw_theme_mode', darkMode ? 'light' : 'dark');
        getStoreItem('forceUpdatePage')?.();
      }}
    />
  );
};
