import { DraggableList, PluginSettingsLayout } from '@cromwell/admin-panel';
import { getRandStr, TPluginSettingsProps } from '@cromwell/core';
import { getRestApiClient, useForceUpdate } from '@cromwell/core-frontend';
import { IconButton, MenuItem, Tooltip } from '@mui/material';
import React, { useState } from 'react';

import { TMainMenuItem, TMainMenuSettings } from '../../types';
import { AddIcon, DoneIcon, ReorderIcon } from '../icons';
import { useStyles } from '../styles';
import { Item } from './components/MenuItem';

export function SettingsPage(props: TPluginSettingsProps<TMainMenuSettings>) {
  const classes = useStyles();
  const forceUpdate = useForceUpdate();
  const [canReorder, setCanReorder] = useState(false);

  const onSave = () => {
    getRestApiClient().purgeRendererEntireCache();
  };

  return (
    <PluginSettingsLayout<TMainMenuSettings> {...props} onSave={onSave}>
      {({ pluginSettings, changeSetting }) => {
        const items = pluginSettings?.items;

        if (items) {
          for (const item of items) {
            if (!item.id) item.id = getRandStr(12);
          }
        }

        const updateItems = (items: TMainMenuItem[]) => {
          if (pluginSettings) pluginSettings.items = items;
        };

        return (
          <>
            <div onClick={() => setCanReorder(!canReorder)} style={{ display: 'flex', alignItems: 'center' }}>
              {canReorder ? (
                <Tooltip title="Apply order">
                  <IconButton>
                    <DoneIcon />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip title="Edit order">
                  <IconButton>
                    <ReorderIcon />
                  </IconButton>
                </Tooltip>
              )}
            </div>
            <div className={classes.itemList}>
              {canReorder && items?.length && (
                <DraggableList
                  data={items}
                  component={Item}
                  onChange={updateItems}
                  itemProps={{
                    items,
                    canReorder,
                    refreshList: forceUpdate,
                  }}
                />
              )}
              {!canReorder &&
                items?.map((data) => {
                  return (
                    <Item
                      data={data}
                      key={data.id}
                      itemProps={{
                        items,
                        canReorder,
                        refreshList: forceUpdate,
                      }}
                    />
                  );
                })}
            </div>
            <div style={{ padding: '5px 10px' }}>
              <div className={`${classes.card} PluginMainMenu-paper`}>
                <MenuItem
                  className={classes.addBtn}
                  onClick={() =>
                    changeSetting('items', [
                      ...(items ?? []),
                      {
                        title: '',
                        id: getRandStr(12),
                      },
                    ])
                  }
                >
                  <AddIcon />
                </MenuItem>
              </div>
            </div>
          </>
        );
      }}
    </PluginSettingsLayout>
  );
}
