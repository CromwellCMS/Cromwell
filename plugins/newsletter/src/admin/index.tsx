import { registerWidget } from '@cromwell/core-frontend';
import { SettingsPage } from './widgets/SettingsPage';
import { Dashboard } from './widgets/Dashboard';

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