import { registerWidget } from '@cromwell/core-frontend';
import { SettingsPage } from './widgets/SettingsPage';

registerWidget({
    pluginName: '@cromwell/plugin-product-filter',
    widgetName: 'PluginSettings',
    component: SettingsPage
});
