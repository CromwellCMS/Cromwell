import { registerThemeEditorPluginBlock } from '@cromwell/admin-panel';
import { registerWidget } from '@cromwell/core-frontend';

import { SettingsPage } from './widgets/SettingsPage';

registerWidget({
  pluginName: '@cromwell/plugin-product-showcase',
  widgetName: 'PluginSettings',
  component: SettingsPage,
});

registerThemeEditorPluginBlock({
  pluginName: '@cromwell/plugin-product-showcase',
  blockName: 'Product showcase',
});
