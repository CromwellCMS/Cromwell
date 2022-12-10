import { registerThemeEditorPluginBlock } from '@cromwell/admin-panel';
import { registerWidget } from '@cromwell/core-frontend';

import { SettingsPage } from './widgets/SettingsPage';
import { ThemeEditor } from './widgets/ThemeEditor';

registerWidget({
  pluginName: '@cromwell/plugin-product-filter',
  widgetName: 'PluginSettings',
  component: SettingsPage,
});

registerThemeEditorPluginBlock({
  pluginName: '@cromwell/plugin-product-filter',
  blockName: 'Product filter',
  component: ThemeEditor,
});
