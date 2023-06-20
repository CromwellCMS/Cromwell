import { PlusIcon } from '@heroicons/react/24/outline';
import { LockClosedIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';

import { SpyIcon } from '../../../components/icons/spyIcon';
import { SettingsPageInfo, useAdminSettings } from '../hooks/useAdminSettings';
import { NewRoleForm } from '../components/newRoleForm';
import { SettingItem } from '../components/settingItem';
import { SettingCategory } from '../components/SettingCategory';

const info: SettingsPageInfo = {
  breadcrumbs: [
    { title: 'Settings', link: '/settings/' },
    { title: 'ACL', link: '/settings/acl' },
  ],
  saveVisible: false,
};

export const ACLSettingsPage = () => {
  const [showRoleForm, setShowRoleForm] = useState(false);
  const { roles } = useAdminSettings(info);

  return (
    <>
      <div className="flex flex-col z-4 gap-6 relative lg:flex-row">
        <SettingCategory
          title="Access Control List"
          fields={
            <>
              <h2 className="font-bold my-2 text-lg">Roles</h2>
              <div className="col-span-2"></div>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 col-span-2">
                {roles.map((role) => (
                  <SettingItem
                    key={role?.id}
                    href={!role.name?.startsWith('admin') ? `/settings/acl/${role.id}` : null}
                    onClick={!role.name?.startsWith('admin') ? null : () => {}}
                    title={`${role?.title}`}
                    icon={
                      !role.name?.startsWith('admin') ? (
                        <LockClosedIcon className="mx-auto h-8 w-8 self-center" />
                      ) : (
                        <SpyIcon className="mx-auto h-8 w-8 self-center" />
                      )
                    }
                    description={
                      !role.name?.startsWith('admin')
                        ? `Customize permissions for ${role.title}.`
                        : `The system administrator with all privileges and access to all resources`
                    }
                  />
                ))}
              </div>

              <hr className="col-span-2 my-2" />
              <SettingItem
                onClick={() => setShowRoleForm(true)}
                className="bg-transparent"
                icon={<PlusIcon className="mx-auto h-8 w-8 self-center" />}
                title="New Role"
                description="Create a new custom role"
              />
            </>
          }
        />
      </div>
      <NewRoleForm show={showRoleForm} onToggle={setShowRoleForm} />
    </>
  );
};
