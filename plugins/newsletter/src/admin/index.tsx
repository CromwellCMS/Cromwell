import { registerThemeEditorPluginBlock } from '@cromwell/admin-panel';
import { registerWidget } from '@cromwell/core-frontend';

import { Dashboard } from './widgets/Dashboard';
import { SettingsPage } from './widgets/SettingsPage';

registerWidget({
  pluginName: '@cromwell/plugin-newsletter',
  widgetName: 'PluginSettings',
  component: SettingsPage,
});

registerWidget({
  pluginName: '@cromwell/plugin-newsletter',
  widgetName: 'Dashboard',
  component: Dashboard,
});

registerThemeEditorPluginBlock({
  pluginName: '@cromwell/plugin-newsletter',
  blockName: 'Newsletter',
});
