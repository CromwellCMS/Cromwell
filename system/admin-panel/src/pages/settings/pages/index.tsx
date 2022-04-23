import {
  CloudIcon,
  CodeIcon,
  CogIcon,
  SearchIcon,
  SwitchVerticalIcon,
} from "@heroicons/react/outline";
import { TemplateIcon } from "@heroicons/react/solid";
import React from "react";
import { Link } from "react-router-dom";
import { TBreadcrumbs } from "../../../components/breadcrumbs";
import { getFileManager } from "../../../components/fileManager/helpers";
import { MarketIcon } from "../../../components/icons/marketicon";
import { StackIcon } from "../../../components/icons/stackIcon";
import { SettingItem } from "../components/settingItem";

const titlePath = [{ title: "Settings" }];

export const SettingsIndexPage = () => {
  return (
    <>
      <TBreadcrumbs path={titlePath} />
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <div className="bg-white rounded-lg shadow-lg w-full p-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
            <SettingItem
              href="/settings/general"
              icon={
                <CogIcon className="mx-auto h-8 w-8 self-center" />
              }
              title="General"
              description="Configure general system settings"
            />

            <SettingItem
              href="/settings/store"
              icon={
                <MarketIcon className="mx-auto h-8 w-8 self-center" />
              }
              title="Store"
              description="E-Commerce settings, shipping and currencies"
            />

            <SettingItem
              href="/settings/seo"
              icon={
                <SearchIcon className="mx-auto h-8 w-8 self-center" />
              }
              title="SEO"
              description="Edit robots.txt, rebuild and view sitemap."
              warning="Warning: Web-technology knowledge required"
            />


            <SettingItem
              onClick={() => getFileManager?.().open()}
              icon={
                <CloudIcon className="mx-auto h-8 w-8 self-center" />
              }
              title="Media Files"
              description="Manage your media files."
            />

            <SettingItem
              href="/themes"
              icon={
                <TemplateIcon className="mx-auto h-8 w-8 self-center" />
              }
              title="Themes"
              description="Customize, add a new theme or change the current active theme."
            />

            <SettingItem
              href="/settings/custom-data"
              icon={
                <StackIcon className="mx-auto h-8 w-8 self-center" />
              }
              title="Custom Data"
              description="Add custom entities and custom data fields to default entities (system, products, posts)."
            />

            <SettingItem
              href="/settings/migration"
              icon={
                <SwitchVerticalIcon className="mx-auto h-8 w-8 self-center" />
              }
              title="Backup & Migration"
              description="Backup all data and import data from backup"
            />

            <SettingItem
              href="/settings/code"
              icon={
                <CodeIcon className="mx-auto h-8 w-8 self-center" />
              }
              title="Code Injection"
              description="Inject code into head and bottom of the website."
              warning="Warning: Web-technology knowledge required"
            />
            
          </div>
        </div>
      </div>
    </>
  );
};
