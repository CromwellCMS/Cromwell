import { readJsonSync } from 'fs-extra';
import { NextApiRequest, NextApiResponse } from 'next';
import { resolve } from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const confPath = resolve(process.cwd(), 'public/admin-configs/public-env.json');
  res.status(200).json(readJsonSync(confPath));
}
