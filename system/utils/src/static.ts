import { getPublicDir, getThumbnailPaths } from '@cromwell/core-backend/dist/helpers/paths';
import { getRestApiClient } from '@cromwell/core-frontend/dist/api/CRestApiClient';
import fs from 'fs-extra';
import { ServerResponse } from 'http';
import mime from 'mime-types';
import normalizePath from 'normalize-path';
import { join } from 'path';

import type { FastifyReply } from 'fastify';

export async function resolvePublicFilePathToServe(requestPath: string): Promise<{ pathInPublicDir?: string }> {
  if (requestPath.startsWith('http')) return {};

  const url = new URL('http://localhost' + requestPath);

  const publicPath = normalizePath(decodeURIComponent(url.pathname)).replace(/^(\.\.(\/|\\|$))+/, '');
  const query = url.searchParams;

  if (publicPath.indexOf('\0') !== -1) {
    throw new Error('Poison Null Bytes');
  }

  let pathInPublicDir = join(getPublicDir(), publicPath);

  if (query.has('crw-thumbnail')) {
    const src = publicPath;
    const width = Number(query.get('width'));
    const height = Number(query.get('height'));
    const quality = Number(query.get('quality'));

    const thumbnail =
      (width &&
        width > 0 &&
        height &&
        height > 0 &&
        width <= 1920 &&
        height <= 1920 &&
        (await getThumbnailPaths({
          src,
          width,
          height,
          quality,
        }).catch(() => null))) ||
      null;

    const supportedExtensions = ['jpg', 'jpeg', 'png', 'webp'];

    if (
      thumbnail?.outFilePath &&
      thumbnail?.originalPath &&
      (thumbnail.originalPath.startsWith('http') ||
        supportedExtensions.find((ext) => thumbnail.originalPath.endsWith('.' + ext)))
    ) {
      if (await fs.pathExists(thumbnail.outFilePath)) {
        pathInPublicDir = thumbnail.outFilePath;
      } else {
        const result = await getRestApiClient()
          .ensureThumbnail({
            src,
            width,
            height,
            quality,
          })
          .catch(() => null);

        if (result?.path) {
          pathInPublicDir = thumbnail.outFilePath;
        }
      }
    }
  }

  return {
    pathInPublicDir:
      (await fs.pathExists(pathInPublicDir)) && (await fs.stat(pathInPublicDir)).isFile() ? pathInPublicDir : undefined,
  };
}

export async function fastifySendFile(reply: FastifyReply, filePath: string) {
  const contentType = mime.lookup(filePath);
  if (contentType) reply.type(contentType);
  return reply.send(fs.createReadStream(filePath));
}

export async function vanillaSendFile(res: ServerResponse, filePath: string) {
  const contentType = mime.lookup(filePath);
  const stat = await fs.stat(filePath);

  res.writeHead(200, {
    'Content-Type': contentType || 'application/octet-stream',
    'Content-Length': stat.size,
  });

  const readStream = fs.createReadStream(filePath);
  return readStream.pipe(res);
}
