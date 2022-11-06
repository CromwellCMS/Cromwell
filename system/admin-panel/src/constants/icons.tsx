import { iconFromPath } from '@cromwell/core-frontend';
import React from 'react';

export const CategoryIcon = iconFromPath(
  <g>
    <path
      d="M107.883,0h-85.27C10.144,0,0.001,10.143,0.001,22.612v85.27c0,12.469,10.143,22.612,22.612,22.612h85.27
				c12.469,0,22.612-10.143,22.612-22.612v-85.27C130.493,10.143,120.352,0,107.883,0z"
    />
    <path
      d="M274.388,0h-85.27c-12.469,0-22.612,10.143-22.612,22.612v85.27c0,12.469,10.143,22.612,22.612,22.612h85.27
				c12.469,0,22.612-10.143,22.612-22.612v-85.27C297,10.143,286.857,0,274.388,0z"
    />
    <path
      d="M107.883,166.507h-85.27c-12.469,0-22.612,10.142-22.612,22.611v85.27C0.001,286.857,10.144,297,22.613,297h85.27
				c12.469,0,22.612-10.143,22.612-22.612v-85.27C130.493,176.649,120.352,166.507,107.883,166.507z"
    />
    <path
      d="M274.388,166.507h-85.27c-12.469,0-22.612,10.143-22.612,22.612v85.27c0,12.469,10.143,22.612,22.612,22.612h85.27
				C286.857,297,297,286.857,297,274.388v-85.27C297,176.649,286.857,166.507,274.388,166.507z"
    />
  </g>,
);

export const PluginIcon = (props) =>
  React.createElement('div', {
    ...props,
    className: props?.className,
    style: {
      backgroundImage: 'url(/admin/static/extension.svg)',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain',
      ...(props?.style ?? {}),
    },
  });
