/**
 * Registers a Plugin on a specific page for frontend (Next.js server)
 * so a plugin will be able to receive its server-side props. If you don't
 * need those props, then you can just use CPlugin without registering.
 * @param pluginName - name in package.json on the plugin
 * @param pageRoute - see `route` in https://cromwellcms.com/docs/development/theme-development#page-config-properties
 * `pageRoute` also can have `*` value to register on all pages.
 */
export const registerPluginSSR = (pluginName: string, pageRoute: string) => {
  plugins.push({
    pluginName,
    pageName: pageRoute,
  });
};

/** @internal */
const plugins: {
  pluginName: string;
  pageName: string;
}[] = [];

/** @internal */
export const getRegisteredPluginsAtPage = (pageName?: string) => {
  const registered: string[] = [];
  for (const plugin of plugins) {
    if (plugin.pageName === '*' || (pageName && plugin.pageName === pageName)) {
      registered.push(plugin.pluginName);
    }
  }
  return registered;
};
