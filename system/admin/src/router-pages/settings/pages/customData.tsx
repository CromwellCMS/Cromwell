import {
  CogIcon,
  HashtagIcon,
  IdentificationIcon,
  PlusIcon,
  ShoppingBagIcon,
  TagIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { DocumentDuplicateIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';

import { SettingsPageInfo, useAdminSettings } from '../hooks/useAdminSettings';
import { NewEntityForm } from '../components/newEntityForm';
import { SettingItem } from '../components/settingItem';
import { SettingCategory } from '../components/SettingCategory';

const info: SettingsPageInfo = {
  breadcrumbs: [
    { title: 'Settings', link: '/settings/' },
    { title: 'Custom Data', link: '/settings/custom-data' },
  ],
  saveVisible: false,
};

export const CustomDataPage = () => {
  const [showEntityForm, setShowEntityForm] = useState(false);
  const { adminSettings } = useAdminSettings(info);

  return (
    <>
      <div className="flex flex-col z-4 gap-6 relative lg:flex-row">
        <SettingCategory
          title="Custom Data"
          description="Select an Entity or add a new one."
          link={{
            content: 'Read more in docs',
            href: 'https://cromwellcms.com/docs/features/custom-data',
          }}
          fields={
            <>
              <h2 className="font-bold my-2 text-lg">Default Entities</h2>
              <div className="col-span-2"></div>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 col-span-2">
                <SettingItem
                  href="/settings/custom-data/product"
                  icon={<ShoppingBagIcon className="mx-auto h-8 w-8 self-center" />}
                  title="Product"
                  description="Customize fields for products"
                />
                <SettingItem
                  href="/settings/custom-data/category"
                  icon={<HashtagIcon className="mx-auto h-8 w-8 self-center" />}
                  title="Category"
                  description="Customize fields for product categories"
                />
                <SettingItem
                  href="/settings/custom-data/post"
                  icon={<DocumentDuplicateIcon className="mx-auto h-8 w-8 self-center" />}
                  title="Post"
                  description="Customize fields for blog posts"
                />
                <SettingItem
                  href="/settings/custom-data/tag"
                  icon={<TagIcon className="mx-auto h-8 w-8 self-center" />}
                  title="Tag"
                  description="Customize fields for blog tags"
                />

                <SettingItem
                  href="/settings/custom-data/user"
                  icon={<UserIcon className="mx-auto h-8 w-8 self-center" />}
                  title="User"
                  description="Customize fields for users"
                />

                <SettingItem
                  href="/settings/custom-data/general"
                  icon={<CogIcon className="mx-auto h-8 w-8 self-center" />}
                  title="General"
                  description="Customize fields for general system settings"
                />
              </div>

              {!!adminSettings.customEntities?.length && (
                <h2 className="font-bold my-2 text-lg col-span-2">Custom Entities</h2>
              )}
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 col-span-2">
                {adminSettings.customEntities?.map((entity) => {
                  return (
                    <SettingItem
                      key={entity.entityType}
                      href={`/settings/custom-data/${entity.entityType}`}
                      icon={
                        entity.icon && entity.icon !== '' ? (
                          <img
                            src={entity.icon}
                            width="32px"
                            height="32px"
                            alt={entity.listLabel}
                            className="mx-auto h-8 w-8 self-center"
                          />
                        ) : (
                          <IdentificationIcon className="mx-auto h-8 w-8 self-center" />
                        )
                      }
                      title={entity.entityLabel}
                      description={`Customize fields for ${entity.entityLabel}`}
                    />
                  );
                })}
              </div>

              <hr className="my-2 col-span-2" />
              <SettingItem
                // href="/settings/custom-data/user"
                onClick={() => setShowEntityForm(true)}
                className="bg-transparent"
                icon={<PlusIcon className="mx-auto h-8 w-8 self-center" />}
                title="New Entity"
                description="Create a new custom entity"
              />
            </>
          }
        />
      </div>
      <NewEntityForm show={showEntityForm} onToggle={(show) => setShowEntityForm(show)} />
    </>
  );
};
