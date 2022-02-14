/**
 * Registers a Plugin on a specific page for frontend (Next.js server)
 * so a plugin will be able to receive its server-side props. If you don't
 * need those props, then you can just use CPlugin without registering.
 */
export const registerPlugin = (pluginName: string, pageName: string) => {
    plugins.push({
        pluginName,
        pageName,
    })
}

/** @internal */
const plugins: {
    pluginName: string;
    pageName: string;
}[] = [];

/** @internal */
export const getRegisteredPluginsAtPage = (pageName: string) => {
    const registered: string[] = [];
    for (const plugin of plugins) {
        if (plugin.pageName === '*' || plugin.pageName === pageName) {
            registered.push(plugin.pluginName);
        }
    }
    return registered;
}