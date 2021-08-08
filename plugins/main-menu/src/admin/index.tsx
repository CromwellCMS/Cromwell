import { registerWidget } from '@cromwell/core-frontend';
import { SettingsPage } from './widgets/SettingsPage';

registerWidget({
    pluginName: '@cromwell/plugin-main-menu',
    widgetName: 'PluginSettings',
    component: SettingsPage
});
