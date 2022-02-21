# Menu plugin for Cromwell CMS

Add website navigation. Elements can be edited on the admin panel plugin's page.  

Supports desktop (row) and mobile (column) modes. You need to use your own solution to detect mobile screen, the plugin needs `mobile` prop to display mobile mode. Otherwise will be displayed desktop mode.

Custom elements: 
- MenuItem
- IconButton
- Popover

Example of usage: 

```tsx
import { IconButton, MenuItem, Popover } from '@mui/material';
import { CPlugin, registerPlugin } from '@cromwell/core-frontend';

registerPlugin('@cromwell/plugin-main-menu', '*');

export default function MyPage() {
  return (
    <CPlugin
      id="menu"
      pluginName="@cromwell/plugin-main-menu"
      plugin={{
        instanceSettings: {
          mobile: true,
          elements: {
            MenuItem,
            IconButton,
            Popover,
          }
        }
      }}
    />
  ) 
}
```