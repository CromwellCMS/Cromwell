import { TBreadcrumbs } from '@components/breadcrumbs';
import { PageStickyHeader } from '@components/entity/entityEdit/components/EntityHeader';
import { EDBEntity } from '@cromwell/core';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { AdminSettingsContextProvider, useAdminSettings, useAdminSettingsContext } from './hooks/useAdminSettings';
import { SettingsIndexPage } from './pages';
import { ACLSettingsPage } from './pages/acl';
import { CodeSettingsPage } from './pages/code';
import { CustomEntitySettingsPage } from './pages/custom/CustomEntity';
import { CustomRoleSettingsPage } from './pages/custom/CustomRole';
import { DefaultEntitySettingsPage } from './pages/custom/DefaultEntity';
import { CustomDataPage } from './pages/customData';
import { GeneralSettingsPage } from './pages/general';
import { MigrationSettingsPage } from './pages/migration';
import { SEOSettingsPage } from './pages/seo';
import { StoreSettingsPage } from './pages/store';

// import SettingsOld from "./SettingsOld"

export const SettingsPage = () => {
  const settings = useAdminSettingsContext();

  return (
    <div className="p-3 md:p-4">
      <PageStickyHeader
        hideSaveButton={!settings.saveVisible}
        disableSaveButton={settings.saveDisabled}
        onSave={settings.onSave}
        sx={{
          maxWidth: '900px',
          padding: '10px 20px',
        }}
        leftContent={
          <h1 className="flex items-center font-500 text-gray-700 h-8 text-base max-w-[50%] overflow-x-auto whitespace-nowrap md:h-9 md:text-xl lg:max-w-fit lg:h-10 lg:text-2xl">
            <TBreadcrumbs path={settings.breadcrumbs} maxVisible={4} />
          </h1>
        }
      />
      <Routes>
        <Route path={`general`} element={<GeneralSettingsPage />} />
        <Route path={`store`} element={<StoreSettingsPage />} />
        <Route path={`code`} element={<CodeSettingsPage />} />
        <Route path={`seo`} element={<SEOSettingsPage />} />
        <Route path={`acl`} element={<ACLSettingsPage />} />
        <Route path={`acl/:roleId`} element={<CustomRoleSettingsPage />} />
        <Route path={`custom-data`} element={<CustomDataPage />} />
        <Route path={`custom-data/product`} element={<DefaultEntitySettingsPage entityType={EDBEntity.Product} />} />
        <Route
          path={`custom-data/category`}
          element={<DefaultEntitySettingsPage entityType={EDBEntity.ProductCategory} />}
        />
        <Route path={`custom-data/post`} element={<DefaultEntitySettingsPage entityType={EDBEntity.Post} />} />
        <Route path={`custom-data/tag`} element={<DefaultEntitySettingsPage entityType={EDBEntity.Tag} />} />
        <Route path={`custom-data/user`} element={<DefaultEntitySettingsPage entityType={EDBEntity.User} />} />
        <Route path={`custom-data/general`} element={<DefaultEntitySettingsPage entityType={EDBEntity.CMS} />} />
        <Route path={`custom-data/:entityType`} element={<CustomEntitySettingsPage />} />
        <Route path={`migration`} element={<MigrationSettingsPage />} />
        <Route index element={<SettingsIndexPage />} />
      </Routes>
    </div>
  );
};

const SettingsPageLoader = ({ children }: { children?: any }) => {
  const { adminSettings } = useAdminSettings({});

  if (!adminSettings) {
    return (
      <>
        <h1 className="font-bold my-3 text-3xl inline-block">...</h1>
      </>
    );
  }

  return <>{children}</>;
};

export const SettingsPageWithProvider = () => {
  return (
    <AdminSettingsContextProvider>
      <SettingsPageLoader>
        <SettingsPage />
      </SettingsPageLoader>
    </AdminSettingsContextProvider>
  );
};

export default SettingsPageWithProvider;
// export default SettingsOld
