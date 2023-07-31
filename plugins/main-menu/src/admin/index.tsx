import { registerThemeEditorPluginBlock } from '@cromwell/admin-panel';
import { registerWidget } from '@cromwell/core-frontend';

import { SettingsPage } from './widgets/SettingsPage';

registerWidget({
  pluginName: '@cromwell/plugin-main-menu',
  widgetName: 'PluginSettings',
  component: SettingsPage,
});

registerThemeEditorPluginBlock({
  pluginName: '@cromwell/plugin-main-menu',
  blockName: 'Main menu',
});
