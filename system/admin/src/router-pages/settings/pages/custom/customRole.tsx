import { TPermission, TPermissionName } from '@cromwell/core';
import { Switch } from '@headlessui/react';
import React, { useMemo } from 'react';
import { Controller, FormProvider, useForm, useFormContext } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import { ActionButton } from '../../../../components/actionButton';
import { TBreadcrumbs } from '../../../../components/breadcrumbs';
import { SwitchInput } from '../../../../components/inputs/SwitchInput';
import { TextInput } from '../../../../components/inputs/TextInput/TextInput';
import { toast } from '../../../../exports';
import { slugify } from '../../../../helpers/slugify';
import { useAdminSettings } from '../../hooks/useAdminSettings';

const path = [
  { title: 'Settings', link: '/settings/' },
  { title: 'ACL', link: '/settings/acl' },
];

const ControlledPermissionOption = ({ name = '', data = null }: { name: string; data?: TPermission }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <PermissionOption
          value={field.value}
          onChange={field.onChange}
          label={data?.title}
          description={data?.description}
        />
      )}
    />
  );
};

const ControlledPermissionCategory = ({
  fields = [],
  title = '',
  description = '',
}: {
  fields?: string[];
  title?: string;
  description?: string;
}) => {
  const { setValue, watch } = useFormContext();

  const value = watch(fields).reduce((a, v) => a && v, true);

  const onChange = (next: boolean) => {
    for (const field of fields) {
      setValue(field, next);
    }
  };

  return (
    <div className="-mb-2 ml-4 block basis-full">
      <div className="flex flex-row mt-8 justify-between">
        <h2 className="font-bold basis-full">{title}</h2>
        <Switch checked={value} onChange={onChange} className="h-full w-full">
          <div className={`mx-2 mr-4 w-full h-full p-3 relative`}>
            <div
              className={`${value ? 'bg-indigo-800' : 'bg-gray-500'}
          absolute right-1 top-1 inline-flex flex-shrink-0 h-[16px] w-[32px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
            >
              <span
                aria-hidden="true"
                className={`${value ? 'translate-x-[15px]' : 'translate-x-0'}
              pointer-events-none inline-block h-[12px] w-[12px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
              />
            </div>
          </div>
        </Switch>
      </div>
      <p className="text-xs text-gray-700">{description}</p>
    </div>
  );
};

const PermissionOption = ({
  value = false,
  onChange = () => false,
  label = '',
  readerText = 'Use setting',
  description = '',
}: {
  value?: boolean;
  onChange?: (v?: boolean) => any;
  readerText?: string;
  label?: any;
  description?: any;
}) => {
  return (
    <div className="h-full w-full">
      <Switch checked={value} onChange={onChange} className="h-full w-full">
        <div
          className={`border rounded-lg shadow-md m-2 w-full h-full p-3 relative ${
            value ? 'shadow-indigo-400 border-indigo-500' : 'bg-white'
          }`}
        >
          <div
            className={`${value ? 'bg-indigo-800' : 'bg-gray-500'}
          absolute right-1 top-1 inline-flex flex-shrink-0 h-[16px] w-[32px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
          >
            <span className="sr-only">{readerText}</span>
            <span
              aria-hidden="true"
              className={`${value ? 'translate-x-[15px]' : 'translate-x-0'}
              pointer-events-none inline-block h-[12px] w-[12px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
            />
          </div>
          <p className="text-base text-left">{label}</p>
          <p className="text-xs text-left text-gray-500">{description}</p>
        </div>
      </Switch>
    </div>
  );
};

export const CustomRoleSettingsPage = () => {
  const { findRole, permissions, saveRole } = useAdminSettings();
  const { roleId } = useParams<{ roleId?: string }>();
  const role = useMemo(() => {
    return findRole(parseInt(roleId));
  }, [roleId, findRole]);

  const permissionMap = useMemo(() => {
    return (role?.permissions || []).reduce((a, v) => ({ ...a, [v]: true }), {});
  }, [role]);

  const methods = useForm({
    defaultValues: {
      id: role?.id,
      title: role?.title,
      isEnabled: role?.isEnabled,
      name: role?.name,
      permissions: permissionMap,
    },
  });

  const orderedPermissions = useMemo(() => {
    return {
      admin: permissions.filter((p) => p.name === 'all'),
      plugins: permissions.filter((p) => p.name.includes('_plugin')),
      themes: permissions.filter((p) => p.name.includes('_theme')),
      posts: permissions.filter((p) => p.name.includes('_post') && !p.name.includes('_post_comment')),
      comments: permissions.filter((p) => p.name.includes('_post_comment')),
      tags: permissions.filter((p) => p.name.includes('_tag')),
      products: permissions.filter(
        (p) => p.name.includes('_product') && !p.name.includes('_product_categ') && !p.name.includes('review'),
      ),
      categories: permissions.filter((p) => p.name.includes('_product_categ')),
      attributes: permissions.filter((p) => p.name.includes('_attribut')),
      orders: permissions.filter((p) => p.name.includes('_order')),
      reviews: permissions.filter((p) => p.name.includes('_review')),
      users: permissions.filter((p) => p.name.includes('_user')),
      roles: permissions.filter((p) => p.name.includes('_role')),
      permissions: permissions.filter((p) => p.name.includes('_permission')),
      entities: permissions.filter((p) => p.name.includes('_custom_entit')),
      coupons: permissions.filter((p) => p.name.includes('_coupon')),
      cms: permissions.filter((p) => p.name.includes('_cms')),
      publicDir: permissions.filter((p) => p.name.includes('_public_dir')),
      files: permissions.filter((p) => p.name.includes('_file')),
      system: permissions.filter((p) => p.name.includes('_system')),
      db: permissions.filter((p) => p.name.includes('_db')),

      thirdParty: permissions.filter((p) => {
        return (
          !p.name.includes('all') &&
          !p.name.includes('_plugin') &&
          !p.name.includes('_theme') &&
          !p.name.includes('_post') &&
          !p.name.includes('_post_comment') &&
          !p.name.includes('_tag') &&
          !p.name.includes('_product') &&
          !p.name.includes('_product_categ') &&
          !p.name.includes('_review') &&
          !p.name.includes('_attribut') &&
          !p.name.includes('_order') &&
          !p.name.includes('_user') &&
          !p.name.includes('_role') &&
          !p.name.includes('_permission') &&
          !p.name.includes('_custom_entit') &&
          !p.name.includes('_coupon') &&
          !p.name.includes('_cms') &&
          !p.name.includes('_public_dir') &&
          !p.name.includes('_file') &&
          !p.name.includes('_db') &&
          !p.name.includes('_system')
        );
      }),
    };
  }, [permissions]);

  const titlePath = useMemo(() => {
    return [
      ...path,
      {
        title: role?.title || 'Not found',
        link: `/settings/acl/${role?.id}`,
      },
    ];
  }, [role]);

  const onSubmit = async (data: { title?: string; name?: string; permissions: typeof permissionMap }) => {
    const { title, name, permissions } = data;
    const permissionList = Object.keys(permissions).filter((p) => permissions[p]) as TPermissionName[];

    const newRole = {
      ...role,
      permissions: permissionList,
      title: title,
      name: name,
    };

    try {
      await saveRole(newRole);
      toast.success(`Role saved`);
    } catch (e) {
      toast.error(`Could not save role.`);
    }
  };

  const { register, setValue, formState, control } = methods;

  const dirtyDefinition = formState.dirtyFields.isEnabled || formState.dirtyFields.title || formState.dirtyFields.name;
  const dirtyPermissions = !!formState.dirtyFields.permissions;

  return (
    <FormProvider {...methods}>
      <form className="relative" onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="flex flex-row bg-gray-100 bg-opacity-60 w-full top-0 z-10 gap-2 backdrop-filter backdrop-blur-lg justify-between sticky">
          <div className="w-full max-w-4xl px-1 lg:px-0">
            <TBreadcrumbs path={titlePath} />
            <ActionButton type="submit" uppercase bold>
              save
            </ActionButton>
          </div>
        </div>

        <div className="flex flex-col gap-2 relative lg:flex-row lg:gap-6">
          <div className="max-h-min my-1 top-16 self-start lg:order-2 lg:my-4 lg:sticky">
            <h2 className="font-bold text-gray-700 col-span-1">{role?.title} definition</h2>
            <p>Edit Role definition</p>
            <p className={`${dirtyDefinition ? 'text-indigo-500' : 'text-transparent'}`}>You have unsaved changes</p>
          </div>

          <div
            className={`bg-white rounded-lg shadow-lg w-full p-4 max-w-4xl ${
              dirtyDefinition ? 'border border-indigo-600 shadow-indigo-400' : 'border border-white'
            }`}
          >
            <div className="grid gap-2 grid-cols-1 lg:grid-cols-2">
              <TextInput
                label="Title"
                placeholder="Custom Role"
                required
                description="Title for the role."
                {...register('title', {
                  required: true,
                  onChange: (event) => {
                    const val = event.target.value;
                    setValue('name', slugify(val));
                  },
                })}
              />
              <TextInput
                label="Name key"
                placeholder="Will be filled automatically"
                required
                description="Internal key for role (will be automatically set)."
                {...register('name', {
                  required: true,
                })}
              />
              <div>
                <Controller
                  name="isEnabled"
                  control={control}
                  render={({ field }) => (
                    <SwitchInput
                      value={field.value}
                      onChange={field.onChange}
                      label={{
                        active: 'Role is active',
                        inactive: 'Role is disabled',
                      }}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col mt-8 z-4 gap-6 relative lg:flex-row">
          <div className="max-h-min my-4 top-16 self-start lg:order-2 lg:max-w-[13rem] lg:sticky">
            <h2 className="font-bold text-gray-700 col-span-1">Permissions</h2>
            <p>Set permissions for {role?.title}.</p>
            <p className="text-red-600">Warning: Wrong configuration may expose features to roles!</p>
            <p className={`${dirtyPermissions ? 'text-indigo-500' : 'text-transparent'}`}>You have unsaved changes</p>
          </div>

          <div
            className={`bg-white rounded-lg shadow-lg w-full p-4 max-w-4xl ${
              dirtyPermissions ? 'border border-indigo-600 shadow-indigo-400' : 'border border-white'
            }`}
          >
            <div className="flex flex-wrap">
              <ControlledPermissionCategory
                title="System"
                description="General system permissions"
                fields={[...orderedPermissions.system, ...orderedPermissions.cms].map((o) => `permissions.${o.name}`)}
              />
              {orderedPermissions.system.map((opt) => (
                <div key={opt.name} className="max-h-[200px] p-2 basis-full lg:basis-1/2">
                  <ControlledPermissionOption key={opt.name} name={`permissions.${opt.name}`} data={opt} />
                </div>
              ))}
              {orderedPermissions.cms.map((opt) => (
                <div key={opt.name} className="max-h-[200px] p-2 basis-full lg:basis-1/2">
                  <ControlledPermissionOption key={opt.name} name={`permissions.${opt.name}`} data={opt} />
                </div>
              ))}

              <ControlledPermissionCategory
                title="Shop - Products"
                description="Set permissions for products"
                fields={orderedPermissions.products.map((o) => `permissions.${o.name}`)}
              />
              {orderedPermissions.products.map((opt) => (
                <div key={opt.name} className="max-h-[200px] p-2 basis-full lg:basis-1/2">
                  <ControlledPermissionOption key={opt.name} name={`permissions.${opt.name}`} data={opt} />
                </div>
              ))}
              <ControlledPermissionCategory
                title="Shop - Orders"
                description="Set permissions for incoming and past orders"
                fields={orderedPermissions.orders.map((o) => `permissions.${o.name}`)}
              />
              {orderedPermissions.orders.map((opt) => (
                <div key={opt.name} className="max-h-[200px] p-2 basis-full lg:basis-1/2">
                  <ControlledPermissionOption key={opt.name} name={`permissions.${opt.name}`} data={opt} />
                </div>
              ))}

              <ControlledPermissionCategory
                title="Shop - Categories"
                description="Set permissions for categories in the shop"
                fields={orderedPermissions.categories.map((o) => `permissions.${o.name}`)}
              />
              {orderedPermissions.categories.map((opt) => (
                <div key={opt.name} className="max-h-[200px] p-2 basis-full lg:basis-1/2">
                  <ControlledPermissionOption key={opt.name} name={`permissions.${opt.name}`} data={opt} />
                </div>
              ))}

              <ControlledPermissionCategory
                title="Shop - Attributes"
                description="Set permissions for product attributes."
                fields={orderedPermissions.attributes.map((o) => `permissions.${o.name}`)}
              />
              {orderedPermissions.attributes.map((opt) => (
                <div key={opt.name} className="max-h-[200px] p-2 basis-full lg:basis-1/2">
                  <ControlledPermissionOption key={opt.name} name={`permissions.${opt.name}`} data={opt} />
                </div>
              ))}

              <ControlledPermissionCategory
                title="Shop - Reviews"
                description="Set permission to add, approve, reject or delete reviews."
                fields={orderedPermissions.reviews.map((o) => `permissions.${o.name}`)}
              />
              {orderedPermissions.reviews.map((opt) => (
                <div key={opt.name} className="max-h-[200px] p-2 basis-full lg:basis-1/2">
                  <ControlledPermissionOption key={opt.name} name={`permissions.${opt.name}`} data={opt} />
                </div>
              ))}

              <ControlledPermissionCategory
                title="Shop - Coupons"
                description="Set permission for coupon campaigns."
                fields={orderedPermissions.coupons.map((o) => `permissions.${o.name}`)}
              />
              {orderedPermissions.coupons.map((opt) => (
                <div key={opt.name} className="max-h-[200px] p-2 basis-full lg:basis-1/2">
                  <ControlledPermissionOption key={opt.name} name={`permissions.${opt.name}`} data={opt} />
                </div>
              ))}

              <ControlledPermissionCategory
                title="Blog - Posts"
                description="Set permissions to draft, write, read and publish posts."
                fields={orderedPermissions.posts.map((o) => `permissions.${o.name}`)}
              />
              {orderedPermissions.posts.map((opt) => (
                <div key={opt.name} className="max-h-[200px] p-2 basis-full lg:basis-1/2">
                  <ControlledPermissionOption key={opt.name} name={`permissions.${opt.name}`} data={opt} />
                </div>
              ))}

              <ControlledPermissionCategory
                title="Blog - Tags"
                description="Set permissions for #Tags in posts."
                fields={orderedPermissions.tags.map((o) => `permissions.${o.name}`)}
              />
              {orderedPermissions.tags.map((opt) => (
                <div key={opt.name} className="max-h-[200px] p-2 basis-full lg:basis-1/2">
                  <ControlledPermissionOption key={opt.name} name={`permissions.${opt.name}`} data={opt} />
                </div>
              ))}

              <ControlledPermissionCategory
                title="Blog - Comments"
                description="Set permissions for blog comments."
                fields={orderedPermissions.comments.map((o) => `permissions.${o.name}`)}
              />
              {orderedPermissions.comments.map((opt) => (
                <div key={opt.name} className="max-h-[200px] p-2 basis-full lg:basis-1/2">
                  <ControlledPermissionOption key={opt.name} name={`permissions.${opt.name}`} data={opt} />
                </div>
              ))}

              <ControlledPermissionCategory
                title="Users"
                description="Set permission for user management."
                fields={orderedPermissions.users.map((o) => `permissions.${o.name}`)}
              />
              {orderedPermissions.users.map((opt) => (
                <div key={opt.name} className="max-h-[200px] p-2 basis-full lg:basis-1/2">
                  <ControlledPermissionOption key={opt.name} name={`permissions.${opt.name}`} data={opt} />
                </div>
              ))}

              <ControlledPermissionCategory
                title="Roles"
                description="Set permissions for role management."
                fields={orderedPermissions.roles.map((o) => `permissions.${o.name}`)}
              />
              {orderedPermissions.roles.map((opt) => (
                <div key={opt.name} className="max-h-[200px] p-2 basis-full lg:basis-1/2">
                  <ControlledPermissionOption key={opt.name} name={`permissions.${opt.name}`} data={opt} />
                </div>
              ))}

              <ControlledPermissionCategory
                title="Media and Files"
                description="Set permissions for cloud files and media."
                fields={[...orderedPermissions.publicDir, ...orderedPermissions.files].map(
                  (o) => `permissions.${o.name}`,
                )}
              />
              {orderedPermissions.publicDir.map((opt) => (
                <div key={opt.name} className="max-h-[200px] p-2 basis-full lg:basis-1/2">
                  <ControlledPermissionOption key={opt.name} name={`permissions.${opt.name}`} data={opt} />
                </div>
              ))}
              {orderedPermissions.files.map((opt) => (
                <div key={opt.name} className="max-h-[200px] p-2 basis-full lg:basis-1/2">
                  <ControlledPermissionOption key={opt.name} name={`permissions.${opt.name}`} data={opt} />
                </div>
              ))}

              <ControlledPermissionCategory
                title="Custom Data"
                description="Set permissions for custom data and custom entities."
                fields={orderedPermissions.entities.map((o) => `permissions.${o.name}`)}
              />
              {orderedPermissions.entities.map((opt) => (
                <div key={opt.name} className="max-h-[200px] p-2 basis-full lg:basis-1/2">
                  <ControlledPermissionOption key={opt.name} name={`permissions.${opt.name}`} data={opt} />
                </div>
              ))}

              <ControlledPermissionCategory
                title="Backup & Migrations"
                description="Set permissions for migrations and backups."
                fields={orderedPermissions.db.map((o) => `permissions.${o.name}`)}
              />
              {orderedPermissions.db.map((opt) => (
                <div key={opt.name} className="max-h-[200px] p-2 basis-full lg:basis-1/2">
                  <ControlledPermissionOption key={opt.name} name={`permissions.${opt.name}`} data={opt} />
                </div>
              ))}
              <hr className="my-4" />
              <div className="-mb-2 ml-4 block basis-full">
                <h2 className="font-bold mt-8 basis-full">Third Party Permissions</h2>
                <p className="text-xs text-gray-700">All permissions that are from third party providers (plugins)</p>
              </div>
              {orderedPermissions.thirdParty.map((opt) => (
                <div key={opt.name} className="max-h-[200px] p-2 basis-full lg:basis-1/2">
                  <ControlledPermissionOption key={opt.name} name={`permissions.${opt.name}`} data={opt} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};
