import { PlusIcon } from '@heroicons/react/24/outline';
import { LockClosedIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';

import { SpyIcon } from '../../../components/icons/spyIcon';
import { SettingsPageInfo, useAdminSettings } from '../hooks/useAdminSettings';
import { NewRoleForm } from '../components/newRoleForm';
import { SettingItem } from '../components/settingItem';

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
        <div className="max-h-min my-4 top-16 self-start lg:order-2 lg:max-w-[13rem] lg:sticky">
          <h2 className="font-bold text-gray-700 col-span-1 text-2xl mb-3">Access Control List</h2>
          {/* <p>Select an Entity or add a new one.</p> */}
          {/* <p className="text-red-600">
            Warning: Changes to custom data are permanent.
          </p> */}
        </div>

        <div className={`bg-white rounded-lg shadow-lg w-full p-4 max-w-4xl border border-white`}>
          <div className="grid gap-2 grid-cols-1">
            <h2 className="font-bold my-2 text-lg">Roles</h2>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
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

            <hr className="my-2" />
            <SettingItem
              onClick={() => setShowRoleForm(true)}
              className="bg-transparent"
              icon={<PlusIcon className="mx-auto h-8 w-8 self-center" />}
              title="New Role"
              description="Create a new custom role"
            />
          </div>
        </div>
      </div>
      <NewRoleForm show={showRoleForm} onToggle={setShowRoleForm} />
    </>
  );
};
