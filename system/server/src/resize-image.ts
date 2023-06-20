import { awaitValue, getLogger } from '@cromwell/core-backend';
import fs from 'fs-extra';
import got from 'got';
import { dirname } from 'path';
import sharp from 'sharp';
import { parentPort } from 'worker_threads';

const logger = getLogger();

export type ResizeImageArgs = {
  width: number;
  height: number;
  src: string;
  quality?: number;
  outPublicDir?: string;
  outFilePath: string;
};

export type ResizeImageOutMessage<T = ResizeImageArgs> = {
  type: 'resizeFinished' | 'resizeError';
  result: ResizeImageResult;
  input?: T;
};

export type ResizeImageResult = {
  outFilePath?: string;
  outFilePublicPath?: string;
  error?: string;
};

const resize = async (args: ResizeImageArgs): Promise<ResizeImageResult> => {
  const { width, height, src, outFilePath } = args;
  await fs.ensureDir(dirname(outFilePath));

  const sharpStream = sharp({ failOn: 'none' });
  const outStream = fs.createWriteStream(outFilePath);

  sharpStream
    .resize({ width, height })
    .webp({ quality: args.quality || 100 })
    .pipe(outStream);

  if (src.startsWith('http')) {
    got.stream(src).pipe(sharpStream);
  } else {
    fs.createReadStream(src).pipe(sharpStream);
  }

  await new Promise<void>((done) => {
    outStream.on('finish', () => {
      done();
    });

    outStream.on('error', (e) => {
      logger.error(e);
      done();
    });

    sharpStream.on('error', (e) => {
      logger.error(e);
      done();
    });

    setTimeout(() => {
      done();
    }, 5000);
  });

  await awaitValue(async () => {
    try {
      await fs.access(outFilePath, fs.constants.R_OK);
      const stat = await fs.statSync(outFilePath);
      return stat.isFile();
    } catch (error) {}
  }, 8);

  return { outFilePath };
};

parentPort?.on('message', async (message: { command: 'resize' } & ResizeImageArgs) => {
  if (message?.command === 'resize') {
    const result = await resize(message).catch((e) => {
      getLogger().error(e);
      return { error: e.message };
    });

    parentPort?.postMessage({
      type: 'resizeFinished',
      input: message,
      result,
    } as ResizeImageOutMessage);
  }
});

process.on('uncaughtException', (err) => {
  logger.error('An unhandled error occurred: ', err);
});
