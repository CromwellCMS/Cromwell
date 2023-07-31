import { TCustomPermission } from '@cromwell/core';
import { registerPermission, registerPermissionCategory } from '@cromwell/core-backend';

export const newsletterPermissions: Record<string, TCustomPermission> = {
  stats: {
    name: 'newsletter_stats',
    title: 'Read Newsletter plugin statistics',
    categoryName: 'newsletter_category',
  },
  export: {
    name: 'newsletter_export',
    title: 'Read Newsletter plugin data (list of subscribers)',
    categoryName: 'newsletter_category',
  },
};

registerPermissionCategory({
  name: 'newsletter_category',
  title: 'Newsletter plugin',
  moduleName: '@cromwell/plugin-newsletter',
  moduleTitle: 'Newsletter plugin',
});

Object.values(newsletterPermissions).forEach(registerPermission);
