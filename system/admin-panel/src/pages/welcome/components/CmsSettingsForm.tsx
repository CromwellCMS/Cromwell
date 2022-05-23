import { getRestApiClient } from '@cromwell/core-frontend';
import { setStoreItem } from '@cromwell/core';
import React, { useState } from 'react';
import { Switch } from "@headlessui/react";
import { TCmsEnabledModules } from '@cromwell/core';
import { LoadingStatus } from "../../../components/loadBox/LoadingStatus";

export function CmsSettingsForm(props: {
  onSuccess: () => void;
}) {
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
  }

  return (
    <div>
      <h2 className="font-medium mt-1 text-xl text-center text-gray-600 dark:text-gray-200">
        Choose your type of website
      </h2>

      <div className="my-4 ml-2">
        <Slider value={modules.blog}
          onChange={() => setModules(prev => ({ ...prev, blog: !prev.blog }))}
          label="Blog"
        />
      </div>
      <div className="my-4 ml-2">
        <Slider value={modules.ecommerce}
          onChange={() => setModules(prev => ({ ...prev, ecommerce: !prev.ecommerce }))}
          label="eCommerce"
        />
      </div>

      <div className="flex mt-4 items-center justify-between">
        <button
          onClick={handleSubmitClick}
          disabled={loading}
          className="rounded bg-gray-700 text-white py-2 px-4 transform transition-colors leading-5 duration-200 hover:bg-gray-600 focus:outline-none"
          type="submit">
          Create
        </button>
      </div>
      <LoadingStatus isActive={loading} />
    </div>
  )
}

const Slider = ({ value, onChange, label }: {
  value: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) => {

  return (
    <Switch
      checked={value}
      onChange={onChange}
      className="flex items-center">
      <div
        className={`mx-2 mr-4 p-3 relative`}>
        <div
          className={`${value ? "bg-indigo-800" : "bg-gray-500"
            }
      absolute right-1 top-1 inline-flex flex-shrink-0 h-[16px] w-[32px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}>
          <span
            aria-hidden="true"
            className={`${value
              ? "translate-x-[15px]"
              : "translate-x-0"
              }
          pointer-events-none inline-block h-[12px] w-[12px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
          />
        </div>
      </div>
      <p>{label}</p>
    </Switch>
  )
}