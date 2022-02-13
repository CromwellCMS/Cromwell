import { HttpStatus } from '@nestjs/common';

import { TEnv } from '../helpers/settings';

export const getErrorFormatter = (env: TEnv) => (err: any) => {
    return {
        message: err.originalError?.message,
        path: err.path,
        statusCode: Number(err.originalError?.status),
        status: HttpStatus[err.originalError?.status + ''] ?? err.extensions?.code ??
            'INTERNAL_SERVER_ERROR',
        timestamp: new Date().toISOString(),
        ...(env.envMode === 'dev' ? {
            locations: err.locations,
            stacktrace: err.originalError.stack,
        } : {}),
    }
}
