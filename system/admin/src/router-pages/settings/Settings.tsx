import { EDBEntity } from '@cromwell/core';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AdminSettingsContextProvider, useAdminSettings } from '../../hooks/useAdminSettings';
import { SettingsIndexPage } from './pages';
import { ACLSettingsPage } from './pages/acl';
import { CodeSettingsPage } from './pages/code';
import { CustomEntitySettingsPage } from './pages/custom/customEntity';
import { CustomRoleSettingsPage } from './pages/custom/customRole';
import { DefaultEntitySettingsPage } from './pages/custom/defaultEntity';
import { CustomDataPage } from './pages/customData';
import { GeneralSettingsPage } from './pages/general';
import { MigrationSettingsPage } from './pages/migration';
import { SEOSettingsPage } from './pages/seo';
import { StoreSettingsPage } from './pages/store';
// import SettingsOld from "./SettingsOld"

export const SettingsPage = () => {
  return (
    <div className="p-2 md:p-4">
      <Routes>
        <Route path={`general`} element={<GeneralSettingsPage />} />
        <Route path={`store`} element={<StoreSettingsPage />} />
        <Route path={`code`} element={<CodeSettingsPage />} />
        <Route path={`seo`} element={<SEOSettingsPage />} />
        <Route path={`acl`} element={<ACLSettingsPage />} />
        <Route path={`acl/:roleId`} element={<CustomRoleSettingsPage />} />
        <Route path={`custom-data`} element={<CustomDataPage />} />
        <Route
          path={`custom-data/product`}
          element={() => <DefaultEntitySettingsPage entityType={EDBEntity.Product} />}
        />
        <Route
          path={`custom-data/category`}
          element={() => <DefaultEntitySettingsPage entityType={EDBEntity.ProductCategory} />}
        />
        <Route path={`custom-data/post`} element={() => <DefaultEntitySettingsPage entityType={EDBEntity.Post} />} />
        <Route path={`custom-data/tag`} element={() => <DefaultEntitySettingsPage entityType={EDBEntity.Tag} />} />
        <Route path={`custom-data/user`} element={() => <DefaultEntitySettingsPage entityType={EDBEntity.User} />} />
        <Route path={`custom-data/general`} element={() => <DefaultEntitySettingsPage entityType={EDBEntity.CMS} />} />
        <Route path={`custom-data/:entityType`} element={<CustomEntitySettingsPage />} />
        <Route path={`migration`} element={<MigrationSettingsPage />} />
        <Route element={<SettingsIndexPage />} />
        {/* <Route path={`general`} component={SettingsIndexPage} /> */}
      </Routes>
    </div>
  );
};

const SettingsPageLoader = ({ children }: { children?: any }) => {
  const { adminSettings } = useAdminSettings();

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
