import { TFrontendPluginProps, TGetPluginStaticProps } from '@cromwell/core';
import { Link } from '@cromwell/core-frontend';
import React, { useState } from 'react';

import { TInstanceSettings, TMainMenuItem, TMainMenuSettings } from '../types';
import { DefaultIconButton, DefaultMenuItem, DefaultPopover, ExpandMoreIcon } from './DefaultElements';


const MainMenu = (props: TFrontendPluginProps<TMainMenuSettings, TInstanceSettings>) => {
  const items = props?.data?.items ?? [];
  const [activeItem, setActiveItem] = useState<string>('none');
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const isMobile = props.instanceSettings?.mobile || false;

  const { MenuItem = DefaultMenuItem, IconButton = DefaultIconButton,
    Popover = DefaultPopover } = props.instanceSettings?.elements ?? {};

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    if (!isMobile) {
      setAnchorEl(null);
      setActiveItem('none');
    }
  };

  const handleItemMouseOver = (item: TMainMenuItem) => (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (!isMobile) {
      handlePopoverOpen(event);
      setActiveItem(item.title);
    }
  }

  const handleItemMobileClick = (item: TMainMenuItem) => (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.stopPropagation();
    event.preventDefault();
    setActiveItem(item.title);
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      width: '100%',
      position: 'relative',
    }}>
      {items.map((i, index) => {
        const isActive = activeItem === i.title;

        const menuSubitems = (
          <div style={{
            gridTemplateColumns: `repeat(${i.sublinkCols ? i.sublinkCols : 1}, 1fr)`,
            position: 'relative',
          }}>
            {i.sublinks?.length && i.sublinks.map((sub, subIndex) => {
              return (
                <MenuItem
                  key={subIndex}
                ><Link href={sub.href + ''} style={{ textDecoration: 'none' }}>
                    <p style={{
                      margin: 0,
                      color: '#111',
                      fontWeight: 400,
                    }}>{sub?.title ?? ''}</p>
                  </Link>
                </MenuItem>
              )
            })}
          </div>
        )


        const menuItem = (
          <div key={index}
            onMouseLeave={handlePopoverClose}
            onMouseOver={handleItemMouseOver(i)}
            style={{
              position: 'relative',
            }} >
            <MenuItem >
              <div style={{
                display: 'flex',
                alignItems: 'center',
              }}>
                <p style={{
                  margin: 0,
                  color: '#111',
                  fontWeight: 400,
                }}>{i.title}</p>
                {isMobile && (i.sublinks?.length || i.html) && (
                  <IconButton onClick={handleItemMobileClick(i)}>
                    <ExpandMoreIcon
                      style={{
                        transform: isActive ? 'rotate(180deg)' : '',
                        transition: '0.3s',
                      }}
                    />
                  </IconButton>
                )}

              </div>
              {(i.sublinks?.length || i.html) && isMobile && isActive
                && menuSubitems}
              {(i.sublinks?.length || i.html) && !isMobile && (
                <Popover
                  id={i.title}
                  open={isActive}
                  anchorEl={anchorEl}
                >
                  {menuSubitems}
                </Popover>
              )}
            </MenuItem>
          </div>
        )

        if (i.href) {
          return <Link href={i.href} key={index} style={{ textDecoration: 'none' }}>{menuItem}</Link>
        }
        return menuItem;
      })}
    </div>
  )
}

export default MainMenu;

export const getStaticProps: TGetPluginStaticProps<TMainMenuSettings | undefined, TMainMenuSettings> = async (context) => {
  return {
    props: context.pluginSettings
  }
}