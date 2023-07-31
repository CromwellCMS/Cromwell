import React from 'react';

export function SettingCategory({
  dirty,
  fields,
  title,
  description,
  warning,
  link,
}: {
  fields: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  warning?: React.ReactNode;
  link?: {
    href: string;
    content: React.ReactNode;
  };
  dirty?: boolean;
}) {
  return (
    <div className="flex flex-col z-4 relative lg:flex-row mb-8 lg:gap-6">
      <div className="max-h-min my-4 lg:max-w-[15rem] lg:w-[15rem] top-16 self-start lg:sticky">
        <h2 className="font-bold text-gray-700 col-span-1 text-2xl mb-3">{title}</h2>
        <p>{description}</p>
        {warning && <p className="text-yellow-600 my-2">{warning}</p>}
        {link && (
          <p className="my-2">
            <a href={link.href} target="_blank" rel="noreferrer">
              {link?.content}
            </a>
          </p>
        )}
        <p className={`${dirty ? 'text-indigo-500' : 'text-transparent'} my-2`}>You have unsaved changes</p>
      </div>

      <div
        className={`bg-white rounded-lg shadow-lg w-full p-4 max-w-4xl ${
          dirty ? 'border border-indigo-600 shadow-indigo-400' : 'border border-white'
        }`}
      >
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">{fields}</div>
      </div>
    </div>
  );
}
