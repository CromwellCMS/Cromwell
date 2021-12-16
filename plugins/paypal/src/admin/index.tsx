import { registerWidget } from '@cromwell/core-frontend';

import { pluginName } from '../constants';
import { SettingsPage } from './widgets/SettingsPage';

registerWidget({
    pluginName,
    widgetName: 'PluginSettings',
    component: SettingsPage
});