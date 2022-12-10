import { useForceUpdate } from '@cromwell/core-frontend';
import { CardActionArea, CardActions, Collapse, IconButton, MenuItem, TextField } from '@mui/material';
import clsx from 'clsx';
import React from 'react';

import { TMainMenuItem } from '../../../types';
import { AddIcon, ExpandMoreIcon, HighlightOffIcon } from '../../icons';
import { useStyles } from '../../styles';

export const Item = (props: {
  data: TMainMenuItem;
  itemProps?: {
    items: TMainMenuItem[];
    canReorder: boolean;
    refreshList: () => void;
  };
}) => {
  const { refreshList, items, canReorder } = props.itemProps ?? {};
  const item = props.data;

  const forceUpdate = useForceUpdate();
  const classes = useStyles();
  const [_expanded, setExpanded] = React.useState(false);
  const expanded = _expanded && !canReorder;

  if (!item) return null;

  const handleExpandClick = () => {
    if (canReorder) return;
    setExpanded(!_expanded);
  };

  const handleChange = (prop: keyof TMainMenuItem, val: string) => {
    (item as any)[prop] = val;
    forceUpdate();
  };

  const handleRemove = (event) => {
    event.stopPropagation();
    if (items) {
      items.splice(items.indexOf(item), 1);
      refreshList?.();
    }
  };

  return (
    <div className={`${classes.card} PluginMainMenu-paper`}>
      <CardActionArea className={classes.cardHeader} onClick={handleExpandClick}>
        <p className={classes.cardTitle}>{item.title}</p>
        <CardActions disableSpacing className={classes.cardActions}>
          {!canReorder && (
            <IconButton
              className={clsx(classes.expand, {
                [classes.expandOpen]: expanded,
              })}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </IconButton>
          )}
          <IconButton onClick={handleRemove}>
            <HighlightOffIcon />
          </IconButton>
        </CardActions>
      </CardActionArea>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <div className={classes.cardContent}>
          <TextField
            label="Title"
            variant="outlined"
            value={item.title}
            className={classes.field}
            onChange={(e) => {
              handleChange('title', e.target.value);
            }}
          />
          <TextField
            label="Link"
            variant="outlined"
            value={item.href}
            className={classes.field}
            onChange={(e) => {
              handleChange('href', e.target.value);
            }}
          />
          <TextField
            label="Columns"
            variant="outlined"
            value={item.sublinkCols}
            className={classes.field}
            onChange={(e) => {
              handleChange('sublinkCols', e.target.value);
            }}
          />
          <TextField
            label="Width in px"
            variant="outlined"
            value={item.width}
            className={classes.field}
            onChange={(e) => {
              handleChange('width', e.target.value);
            }}
          />
          <TextField
            value={item.html}
            label="Custom HTML"
            multiline
            rows={4}
            variant="outlined"
            className={classes.field}
            onChange={(e) => {
              handleChange('html', e.target.value);
            }}
          />
          <div className={classes.sublinksList}>
            <h3 className={classes.sublinksTitle}>Sublinks</h3>
            {item.sublinks &&
              item.sublinks.map((sl, slIndex) => {
                return (
                  <div className={`${classes.sublinkItem} PluginMainMenu-paper`}>
                    <TextField
                      label="Sublink title"
                      variant="outlined"
                      value={sl.title}
                      className={classes.subField}
                      onChange={(e) => {
                        if (item.sublinks) item.sublinks[slIndex].title = e.target.value;
                        forceUpdate();
                      }}
                    />
                    <TextField
                      label="Sublink href"
                      variant="outlined"
                      value={sl.href}
                      className={classes.subField}
                      onChange={(e) => {
                        if (item.sublinks) item.sublinks[slIndex].href = e.target.value;
                        forceUpdate();
                      }}
                    />
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        if (item.sublinks) item.sublinks.splice(slIndex, 1);
                        refreshList?.();
                      }}
                    >
                      <HighlightOffIcon />
                    </IconButton>
                  </div>
                );
              })}
            <div className={`PluginMainMenu-paper ${classes.card}`}>
              <MenuItem
                className={classes.addBtn}
                onClick={() => {
                  if (!item.sublinks) item.sublinks = [];
                  item.sublinks.push({});
                  forceUpdate();
                }}
              >
                <AddIcon />
              </MenuItem>
            </div>
          </div>
        </div>
      </Collapse>
    </div>
  );
};
