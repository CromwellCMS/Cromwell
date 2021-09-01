import { registerWidget } from '@cromwell/core-frontend';
import { SettingsPage } from './widgets/SettingsPage';
import { ThemeEditor } from './widgets/ThemeEditor';

registerWidget({
    pluginName: '@cromwell/plugin-product-filter',
    widgetName: 'PluginSettings',
    component: SettingsPage
});

registerWidget({
    pluginName: '@cromwell/plugin-product-filter',
    widgetName: 'ThemeEditor',
    component: ThemeEditor
});