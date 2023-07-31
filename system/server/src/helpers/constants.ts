import { getPublicDir, TAuthUserInfo } from '@cromwell/core-backend';
import multer from 'fastify-multer';
import { join } from 'path';

import { UserDto } from '../dto/user.dto';

export const publicSystemDirs = ['bundled-modules'];

export type TServerCommands = 'build' | 'dev' | 'prod';

export const restartMessage = 'crw_restart_server';

export const restartServer = () => {
  if (process.send)
    process.send(
      JSON.stringify({
        message: restartMessage,
      }),
    );
};

export type TLoginInfo = {
  accessToken: string;
  refreshToken: string;
  userInfo: TAuthUserInfo;
  userDto: UserDto;
} | null;

export type Writeable<T> = {
  -readonly [P in keyof T]: T[P];
};

export type DeepWriteable<T> = {
  -readonly [P in keyof T]: DeepWriteable<T[P]>;
};

export const multerPublicStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const fileDir = join(getPublicDir(), (req.query as any).inPath || '');
    cb(null, fileDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
