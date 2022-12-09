import {
  ArrowsUpDownIcon,
  CloudIcon,
  CodeBracketIcon,
  CogIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { RectangleGroupIcon } from '@heroicons/react/24/solid';
import React from 'react';

import { TBreadcrumbs } from '../../../components/breadcrumbs';
import { getFileManager } from '../../../components/fileManager/helpers';
import { MarketIcon } from '../../../components/icons/marketicon';
import { StackIcon } from '../../../components/icons/stackIcon';
import { SettingItem } from '../components/settingItem';

const titlePath = [{ title: 'Settings' }];

export const SettingsIndexPage = () => {
  return (
    <>
      <TBreadcrumbs path={titlePath} />
      <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
        <div className="bg-white rounded-lg shadow-lg w-full p-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
            <SettingItem
              href="/settings/general"
              icon={<CogIcon className="mx-auto h-8 w-8 self-center" />}
              title="General"
              description="Configure general system settings"
            />

            <SettingItem
              href="/settings/store"
              icon={<MarketIcon className="mx-auto h-8 w-8 self-center" />}
              title="Store"
              description="E-Commerce settings, shipping and currencies"
            />

            <SettingItem
              href="/settings/acl"
              icon={<UserGroupIcon className="mx-auto h-8 w-8 self-center" />}
              title="Access Control List"
              description="Configure roles and permissions for users."
            />

            <SettingItem
              href="/settings/seo"
              icon={<MagnifyingGlassIcon className="mx-auto h-8 w-8 self-center" />}
              title="SEO"
              description="Edit robots.txt, rebuild and view sitemap."
              warning="Warning: Web-technology knowledge required"
            />

            <SettingItem
              onClick={() => getFileManager?.().open()}
              icon={<CloudIcon className="mx-auto h-8 w-8 self-center" />}
              title="Media Files"
              description="Manage your media files."
            />

            <SettingItem
              href="/themes"
              icon={<RectangleGroupIcon className="mx-auto h-8 w-8 self-center" />}
              title="Themes"
              description="Customize, add a new theme or change the current active theme."
            />

            <SettingItem
              href="/settings/custom-data"
              icon={<StackIcon className="mx-auto h-8 w-8 self-center" />}
              title="Custom Data"
              description="Add custom entities and custom data fields to default entities (system, products, posts)."
            />

            <SettingItem
              href="/settings/migration"
              icon={<ArrowsUpDownIcon className="mx-auto h-8 w-8 self-center" />}
              title="Backup & Migration"
              description="Backup all data and import data from backup"
            />

            <SettingItem
              href="/settings/code"
              icon={<CodeBracketIcon className="mx-auto h-8 w-8 self-center" />}
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
