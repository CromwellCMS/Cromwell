import { HttpStatus } from '@nestjs/common';

import { loadEnv, TEnv } from '../helpers/settings';

export const getErrorFormatter = (env: TEnv) => (err: any) => {
  const { envMode } = loadEnv();
  const status = err.originalError?.status;

  if (envMode !== 'prod' || (envMode === 'prod' && !status)) {
    console.error(err);
  }

  return {
    message: err.originalError?.message,
    path: err.path,
    statusCode: Number(status),
    status: HttpStatus[status + ''] ?? err.extensions?.code ?? 'INTERNAL_SERVER_ERROR',
    timestamp: new Date().toISOString(),
    ...(env.envMode === 'dev'
      ? {
          locations: err.locations,
          stacktrace: err.originalError.stack,
        }
      : {}),
  };
};
