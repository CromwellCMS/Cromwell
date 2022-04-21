import { TCustomPermission } from '@cromwell/core';
import { registerPermission } from '@cromwell/core-backend';

export const newsletterPermissions: Record<string, TCustomPermission> = {
    stats: {
        name: 'newsletter_stats',
        title: 'Read Newsletter plugin statistics'
    },
    export: {
        name: 'newsletter_export',
        title: 'Read Newsletter plugin data (list of subscribers)'
    },
}

Object.values(newsletterPermissions).forEach(registerPermission);