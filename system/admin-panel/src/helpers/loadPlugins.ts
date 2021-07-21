import { TPluginEntity } from '@cromwell/core';
import { getGraphQLClient, getRestAPIClient } from '@cromwell/core-frontend';

const loadedPlugins: string[] = [];

export const loadPlugin = async (pluginName) => {
    try {
        const bundle = await getRestAPIClient().getPluginAdminBundle(pluginName, { disableLog: true });
        const success = await new Promise(done => {
            const sourceBlob = new Blob([bundle.source], { type: 'text/javascript' });
            const objectURL = URL.createObjectURL(sourceBlob);
            const domScript = document.createElement('script');
            domScript.id = pluginName;
            domScript.src = objectURL;
            domScript.onload = () => done(true);
            domScript.onerror = () => done(false);
            document.head.appendChild(domScript);
        });
        if (!success) console.error('Failed to load plugin: ' + pluginName);
        else loadedPlugins.push(pluginName);
    } catch (error) {
        console.error(error);
    }
}

export const loadPlugins = async (options: {
    onlyNew?: boolean;
} = {}) => {
    const graphClient = getGraphQLClient();
    let pluginEntities: TPluginEntity[];
    try {
        pluginEntities = await graphClient.getAllEntities('Plugin',
            graphClient.PluginFragment, 'PluginFragment');
    } catch (e) { console.error(e); }

    if (!pluginEntities || !Array.isArray(pluginEntities)) return;

    const pluginPromises: Promise<any>[] = [];

    for (const entity of pluginEntities) {
        if (options?.onlyNew && loadedPlugins.includes(entity.name)) continue;

        pluginPromises.push(loadPlugin(entity.name));
    }

    await Promise.all(pluginPromises);
}