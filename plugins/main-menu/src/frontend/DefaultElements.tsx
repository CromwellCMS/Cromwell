import { iconFromPath } from '@cromwell/core-frontend';
import React from 'react';

export const ExpandMoreIcon = iconFromPath(<path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path>);

export const DefaultMenuItem = (props) => {
  const [hover, setHover] = React.useState(false);

  return (
    <div {...props} onMouseOver={() => setHover(true)} onMouseOut={() => setHover(false)}
      style={{
        padding: '6px 15px',
        backgroundColor: hover ? '#ddd' : '#fff',
        transition: '0.3s',
      }} />
  )
}

export const DefaultIconButton = (props) => <div {...props} style={{ display: 'flex', padding: '5px' }} />

export const DefaultPopover = (props) => <div style={{
  position: 'absolute',
  top: props.anchorEl?.clientHeight + 'px',
  left: 0,
  zIndex: 10000,
  backgroundColor: '#fff',
  boxShadow: '0 2px 3px 0 rgba(0, 0, 0, 0.05), 0 0 20px 4px rgba(0, 0, 0, 0.1)',
  borderRadius: '0 0 6px 6px',
  minWidth: '150px',
}}>{props.open && props.children}</div>
