import { registerWidget } from '@cromwell/core-frontend';
import { SettingsPage } from './SettingsPage';

registerWidget({
    pluginName: '@cromwell/plugin-main-menu',
    widgetName: 'PluginSettings',
    component: SettingsPage
});
