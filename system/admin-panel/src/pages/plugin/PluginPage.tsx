import React from 'react';
import { getRestAPIClient, loadFrontendBundle } from '@cromwell/core-frontend';

const PluginPage = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const pluginName = urlParams.get('pluginName');

    const PageComp = loadFrontendBundle(pluginName,
        () => getRestAPIClient()?.getPluginAdminBundle(pluginName));

    return PageComp ? (
        <PageComp />
    ) : <div></div>;
}

export default PluginPage;
