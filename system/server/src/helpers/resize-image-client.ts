import { getRandStr } from '@cromwell/core';
import { getLogger, getResizedImagePaths, getServerBuildResizeImagePath } from '@cromwell/core-backend';
import fs from 'fs-extra';
import { Worker } from 'worker_threads';

import { ResizeImageArgs, ResizeImageOutMessage, ResizeImageResult } from '../resize-image';

const scriptPath = getServerBuildResizeImagePath();
if (!scriptPath) throw new Error('Could not define resize image build path');

const logger = getLogger();

type CustomOutMessage = ResizeImageOutMessage<ResizeImageArgs & { id: string }>;

const state = {
  worker: null as Worker | null,
  workerListeners: {} as Record<string, (message: CustomOutMessage) => void>,
};

function createWorker() {
  try {
    if (!scriptPath) throw new Error('Could not define resize image build path');

    state.worker = new Worker(scriptPath);

    state.worker.on('exit', (code) => {
      logger.warn(`resize-image worker stopped with exit code ${code}`);
      state.worker = null;

      for (const listener of Object.values(state.workerListeners)) {
        listener({
          type: 'resizeError',
          result: { error: `resize-image worker stopped with exit code ${code}` },
        });
      }
    });

    state.worker.on('message', (message: CustomOutMessage) => {
      if (message.type === 'resizeFinished') {
        for (const listener of Object.values(state.workerListeners)) {
          listener(message);
        }
      }
    });
  } catch (error) {
    getLogger().error(error);
    return {
      error: 'Could not start resize worker',
    };
  }
}

export type ResizeImageClientArgs = {
  width: number;
  height: number;
  src: string;
  quality?: number;
  outPublicDir?: string;
  skipIfGenerated?: boolean;
};

export async function resizeImage(args: ResizeImageClientArgs): Promise<ResizeImageResult> {
  if (!state.worker) createWorker();

  return new Promise<ResizeImageResult>((done) => {
    (async () => {
      const imagePaths = await getResizedImagePaths(args);

      if (args.skipIfGenerated && (await fs.pathExists(imagePaths.outFilePath))) {
        done({
          outFilePath: imagePaths.outFilePath,
          outFilePublicPath: imagePaths.outFilePublicPath,
        });
        return;
      }

      const input = {
        ...args,
        src: imagePaths.originalPath,
        outFilePath: imagePaths.outFilePath,
        id: getRandStr(16),
      } as ResizeImageArgs & { id: string };

      state.workerListeners[input.id] = (message: CustomOutMessage) => {
        if (message.type === 'resizeError' || (message.type === 'resizeFinished' && message.input?.id === input.id)) {
          done({
            ...message.result,
            outFilePath: imagePaths.outFilePath,
            outFilePublicPath: imagePaths.outFilePublicPath,
          });
          delete state.workerListeners[input.id];
        }
      };

      state.worker!.postMessage({
        command: 'resize',
        ...input,
      });

      setTimeout(() => {
        done({
          error: 'Resize timeout',
        });
        delete state.workerListeners[input.id];
      }, 15 * 1000);
    })().catch(logger.error);
  });
}
