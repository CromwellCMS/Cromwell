import React, { useCallback, useState } from 'react';
import { TBreadcrumbs } from '../../../components/breadcrumbs';
import { Controller, FormProvider, useForm, useFormContext } from 'react-hook-form';
import { Switch } from '@headlessui/react';
import { DownloadIcon } from '@heroicons/react/24/solid';
import { ArrowSmUpIcon } from '@heroicons/react/24/outline';
import { getRestApiClient } from '@cromwell/core-frontend';
import { LoadingStatus } from '../../../components/loadBox/LoadingStatus';
import { toast } from '../../../components/toast/toast';

const exportOptions = [
  {
    key: 'Product',
    title: 'Products',
    checked: true,
    description:
      'All products including id, title, price, category reference, sku, image link, stock status, description and custom data.',
  },
  {
    key: 'ProductCategory',
    title: 'Categories',
    checked: true,
    description:
      'All product categories including id, title, main image link, description, hierarchies and custom data.',
  },
  {
    key: 'ProductReview',
    title: 'Reviews',
    checked: true,
    description:
      'All product reviews including id, product reference, title, description, rating, user name, approval status.',
  },
  {
    key: 'Attribute',
    title: 'Attributes',
    checked: true,
    description: 'All custom product attributes (meta fields) including id, key, values, type, icon.',
  },
  {
    key: 'Coupon',
    title: 'Coupons',
    checked: true,
    description:
      'All coupons including code, description, and coupon conditions such as allow-free-shipping, expiration date, usage limits and used times.',
  },
  {
    key: 'Post',
    title: 'Posts',
    checked: true,
    description:
      'All blog posts including id, creation date, title, author reference, content, excerpt, main image link, read time, tag references, published status, comment references and custom data.',
  },
  {
    key: 'Tag',
    title: 'Tags',
    checked: true,
    description: 'All post tags including id, name, color, image link and description.',
  },
  {
    key: 'Order',
    title: 'Orders',
    checked: true,
    description:
      'All orders including id, cart data, order total price, checkout price, shipping price, total quantity, user reference, customer name, customer phone, customer email, customer address, comments, payment methods, currency, custom, coupon codes, custom data.',
  },
  {
    key: 'User',
    title: 'Users',
    checked: true,
    description:
      'All users including id, full name, email, avatar, bio, phone, address, role, encrypted password and custom data.',
  },
  {
    key: 'CustomEntity',
    title: 'Custom entities',
    checked: true,
    description: "All custom entities including it's meta field settings.",
  },
  {
    key: 'Plugin',
    title: 'Plugins',
    checked: false,
    description: 'Export plugins and plugin settings',
  },
  {
    key: 'Theme',
    title: 'Themes',
    checked: false,
    description: 'Export themes and theme settings',
  },
  {
    key: 'CMS',
    title: 'System settings',
    checked: false,
    description: 'Export all settings and custom data.',
  },
];

const titlePath = [
  { title: 'Settings', link: '/settings/' },
  {
    title: 'Backup & Migration',
    link: '/settings/migration',
  },
];

const ControlledBackupOption = ({
  name = '',
  data = null,
}: {
  name: string;
  data?: ArrayElement<typeof exportOptions>;
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <BackupOption
          value={field.value}
          onChange={field.onChange}
          label={data?.title}
          description={data?.description}
        />
      )}
    />
  );
};

const BackupOption = ({
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
          <p className="font-bold text-lg text-left">{label}</p>
          <p className="text-xs text-left text-gray-500">{description}</p>
        </div>
      </Switch>
    </div>
  );
};

export const MigrationSettingsPage = () => {
  const [processing, setProcessing] = useState(false);
  const methods = useForm({
    defaultValues: {
      exportData: exportOptions,
      importOverride: false,
    },
  });

  const onSubmit = async () => {
    // do nothing
  };

  const exportDB = useCallback(async (data: { exportData: typeof exportOptions }) => {
    setProcessing(true);
    const { exportData } = data;
    const options = exportData.filter(({ checked }) => checked).map(({ key }) => key);

    try {
      await getRestApiClient().exportDB(options as Extract<typeof exportOptions, 'key'>[]);
    } catch (e) {
      console.error(e);
    }
    setProcessing(false);
  }, []);

  const importDB = useCallback(async ({ importOverride = false }) => {
    const input = document.createElement('input');
    input.style.display = 'none';
    input.multiple = true;
    input.type = 'file';
    input.accept = '.xlsx';
    document.body.appendChild(input);

    input.addEventListener('change', async (e: any) => {
      // Get the selected file from the input element
      const files = e.target?.files;
      if (!files) return;
      setProcessing(true);

      try {
        await getRestApiClient()?.importDB(files, importOverride);
        toast.success?.('Successfully imported');
      } catch (e) {
        console.error(e);
      }
      input.remove();
      setProcessing(false);
    });

    input.click();
  }, []);

  const override = methods.watch('importOverride', false);

  return (
    <FormProvider {...methods}>
      <form className="relative" onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="flex flex-row bg-gray-100 bg-opacity-60 w-full top-0 z-10 gap-2 backdrop-filter backdrop-blur-lg justify-between sticky">
          <div className="w-full max-w-4xl px-1 lg:px-0">
            <TBreadcrumbs path={titlePath} />
          </div>
        </div>

        <div className="flex flex-col z-4 gap-6 relative lg:flex-row">
          <div className="max-h-min my-4 lg:max-w-[13rem] top-16 self-start lg:order-2 lg:sticky">
            <h2 className="font-bold text-gray-700 col-span-1">Backups</h2>
            <p>Backup your system with all data.</p>
            <p>Files are in Excel format (.xlsx)</p>
            {/* <p className="text-red-600">Warning: This is a feature for tech-experts.</p> */}
          </div>

          <div className={`bg-white rounded-lg shadow-lg w-full p-4 max-w-4xl`}>
            <div className="flex flex-wrap">
              {exportOptions.map((opt, idx) => (
                <div key={opt.key} className="max-h-[200px] p-1 basis-full lg:basis-1/2">
                  <ControlledBackupOption key={opt.key} name={`exportData.${idx}.checked`} data={opt} />
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={methods.handleSubmit(exportDB)}
              className="rounded-xl font-bold bg-indigo-600 bg-opacity-0 h-20 mt-4 w-full transform transition-all group hover:bg-opacity-100 hover:shadow-md hover:text-white"
            >
              <DownloadIcon className="font-bold h-5 mr-3 w-5 inline-block group-hover:animate-bounce" />
              download backup
            </button>
          </div>
        </div>

        <div className="flex flex-col mt-10 z-4 gap-6 relative lg:flex-row">
          <div className="max-h-min my-4 lg:max-w-[13rem] top-16 self-start lg:order-2 lg:sticky">
            <h2 className="font-bold text-gray-700 col-span-1">Import</h2>
            <p>Import your backup</p>
            <p className="text-red-600">Warning: This may override all your data. Use with caution.</p>
          </div>

          <div className={`bg-white rounded-lg shadow-lg w-full p-4 max-w-4xl`}>
            <div className="flex flex-wrap">
              <div className="max-h-[200px] p-1 basis-full lg:basis-1/2">
                <ControlledBackupOption
                  name={`importOverride`}
                  data={{
                    key: 'importOverride',
                    checked: false,
                    description: 'Delete all data that is not in the backup file.',
                    title: 'Override database',
                  }}
                />
              </div>
              {override && (
                <p className="font-bold my-3 px-2 text-red-600">
                  Warning: This will override all data and remove items that are not in the backup file. Do you want to
                  continue?
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={methods.handleSubmit(importDB)}
              className={`rounded-xl font-bold ${
                override ? 'bg-red-600' : 'bg-indigo-600'
              } bg-opacity-0 h-20 mt-4 w-full transform transition-all group hover:bg-opacity-100 hover:shadow-md hover:text-white`}
            >
              <ArrowSmUpIcon className="font-bold h-5 mr-3 w-5 inline-block group-hover:animate-bounce" />
              Import backup
            </button>
          </div>
        </div>
      </form>
      <LoadingStatus isActive={processing} />
    </FormProvider>
  );
};
