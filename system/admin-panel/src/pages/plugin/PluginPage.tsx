import React from 'react';
import { getRestAPIClient, loadFrontendBundle } from '@cromwell/core-frontend';
import { useParams } from 'react-router-dom';

const PluginPage = () => {
    const { pluginName } = useParams<{ pluginName: string }>();

    const PageComp = loadFrontendBundle(pluginName,
        () => getRestAPIClient()?.getPluginAdminBundle(pluginName));

    return PageComp ? (
        <PageComp />
    ) : <div></div>;
}

export default PluginPage;
