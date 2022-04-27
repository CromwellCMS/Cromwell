import { EDBEntity } from "@cromwell/core";
import React from "react";
import {
  Route,
  Switch,
  useRouteMatch,
} from "react-router-dom";
import {
  AdminSettingsContextProvider,
  useAdminSettings,
} from "../../hooks/useAdminSettings";
import { SettingsIndexPage } from "./pages";
import { ACLSettingsPage } from "./pages/acl";
import { CodeSettingsPage } from "./pages/code";
import { CustomEntitySettingsPage } from "./pages/custom/customEntity";
import { CustomRoleSettingsPage } from "./pages/custom/customRole";
import { DefaultEntitySettingsPage } from "./pages/custom/defaultEntity";
import { CustomDataPage } from "./pages/customData";
import { GeneralSettingsPage } from "./pages/general";
import { MigrationSettingsPage } from "./pages/migration";
import { SEOSettingsPage } from "./pages/seo";
import { StoreSettingsPage } from "./pages/store";
// import SettingsOld from "./SettingsOld"

export const SettingsPage = () => {
  const match = useRouteMatch();

  return (
    <div className="p-2 md:p-4">
      <Switch>
        <Route
          path={`${match.path}/general`}
          exact
          component={GeneralSettingsPage}
        />
        <Route
          path={`${match.path}/store`}
          exact
          component={StoreSettingsPage}
        />
        <Route
          path={`${match.path}/code`}
          exact
          component={CodeSettingsPage}
        />
        <Route
          path={`${match.path}/seo`}
          exact
          component={SEOSettingsPage}
        />
        <Route
          path={`${match.path}/acl`}
          exact
          component={ACLSettingsPage}
        />
        <Route
          path={`${match.path}/acl/:roleId`}
          component={CustomRoleSettingsPage}
        />
        <Route
          path={`${match.path}/custom-data`}
          component={CustomDataPage}
          exact
        >
        </Route>
        <Route
          path={`${match.path}/custom-data/product`}
          component={() => <DefaultEntitySettingsPage entityType={EDBEntity.Product} />}
        />
        <Route
          path={`${match.path}/custom-data/category`}
          component={() => <DefaultEntitySettingsPage entityType={EDBEntity.ProductCategory} />}
        />
        <Route
          path={`${match.path}/custom-data/post`}
          component={() => <DefaultEntitySettingsPage entityType={EDBEntity.Post} />}
        />
        <Route
          path={`${match.path}/custom-data/tag`}
          component={() => <DefaultEntitySettingsPage entityType={EDBEntity.Tag} />}
        />
        <Route
          path={`${match.path}/custom-data/user`}
          component={() => <DefaultEntitySettingsPage entityType={EDBEntity.User} />}
        />
        <Route
          path={`${match.path}/custom-data/general`}
          component={() => <DefaultEntitySettingsPage entityType={EDBEntity.CMS} />}
        />
        <Route
          path={`${match.path}/custom-data/:entityType`}
          component={CustomEntitySettingsPage}
        />
        <Route
          path={`${match.path}/migration`}
          exact
          component={MigrationSettingsPage}
        />
        <Route
          path={match.path}
          component={SettingsIndexPage}
        />
        {/* <Route path={`${match.path}/general`} component={SettingsIndexPage} /> */}
      </Switch>
    </div>
  );
};

const SettingsPageLoader = ({
  children,
}: {
  children?: any;
}) => {
  const { adminSettings } = useAdminSettings();

  if (!adminSettings) {
    return (
      <>
        <h1 className="font-bold my-3 text-3xl inline-block">
          ...
        </h1>
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