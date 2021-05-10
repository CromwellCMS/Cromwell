import { registerWidget } from '@cromwell/core-frontend';
import { SettingsPage } from './SettingsPage';

registerWidget({
    pluginName: '@cromwell/plugin-product-filter',
    widgetName: 'PluginSettings',
    component: SettingsPage
});
