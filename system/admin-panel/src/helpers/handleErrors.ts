import { getGraphQLErrorInfo } from '@cromwell/core-frontend';

import { toast } from '../components/toast/toast';

export const handleOnSaveError = (error: any): {
    reason?: 'uniqueSlug' | 'uniqueEmail'
} => {
    const info = getGraphQLErrorInfo(error);
    if (info?.message) {

        if (info.message.toLowerCase().includes('UNIQUE constraint'.toLowerCase())) {
            if (info.message.toLowerCase().includes('.slug')) {
                toast.error('Slug (Page URL) is not unique');
                return {
                    reason: 'uniqueSlug',
                }
            }
            if (info.message.toLowerCase().includes('.email')) {
                toast.error('Email is already taken');
                return {
                    reason: 'uniqueEmail',
                }
            }
        }

    }
}