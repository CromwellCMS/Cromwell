import { setStoreItem, TCmsEnabledModules } from '@cromwell/core';
import { getRestApiClient } from '@cromwell/core-frontend';
import React, { useState } from 'react';

import { SwitchInput } from '../../../components/inputs/SwitchInput';
import { LoadingStatus } from '../../../components/loadBox/LoadingStatus';

export function CmsSettingsForm(props: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const apiClient = getRestApiClient();
  const [modules, setModules] = useState<TCmsEnabledModules>({
    blog: true,
    ecommerce: true,
  });

  const handleSubmitClick = async () => {
    if (loading) return;
    setLoading(true);

    try {
      await apiClient.setupCmsSecondStep({
        url: window.location.origin,
        modules,
      });

      const settings = await apiClient.getAdminCmsSettings();
      if (settings) {
        setStoreItem('cmsSettings', settings);
      }

      props.onSuccess();
    } catch (e) {
      console.error(e);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col">
      <h2 className="font-medium my-4 text-xl ml-2 text-gray-600 dark:text-gray-200">Choose your type of website:</h2>

      <div className="my-2 ml-2">
        <SwitchInput
          value={modules.blog}
          onChange={() => setModules((prev) => ({ ...prev, blog: !prev.blog }))}
          label="Blog"
        />
      </div>
      <div className="my-2 ml-2">
        <SwitchInput
          value={modules.ecommerce}
          onChange={() => setModules((prev) => ({ ...prev, ecommerce: !prev.ecommerce }))}
          label="eCommerce"
        />
      </div>

      <div className="flex mt-6 items-center justify-between">
        <button
          onClick={handleSubmitClick}
          disabled={loading}
          className="rounded bg-gray-700 text-white py-2 px-4 transform transition-colors leading-5 duration-200 hover:bg-gray-600 focus:outline-none"
          type="submit"
        >
          Create
        </button>
      </div>
      <LoadingStatus isActive={loading} />
    </div>
  );
}
