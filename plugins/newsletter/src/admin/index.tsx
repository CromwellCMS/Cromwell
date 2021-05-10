import { registerWidget } from '@cromwell/core-frontend';
import { SettingsPage } from './SettingsPage';
import { Dashboard } from './Dashboard';

registerWidget({
    pluginName: '@cromwell/plugin-newsletter',
    widgetName: 'PluginSettings',
    component: SettingsPage
});

registerWidget({
    pluginName: '@cromwell/plugin-newsletter',
    widgetName: 'Dashboard',
    component: Dashboard
});