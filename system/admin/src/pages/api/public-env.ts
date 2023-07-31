import { readJsonSync } from 'fs-extra';
import { NextApiRequest, NextApiResponse } from 'next';
import { resolve } from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const configPath = resolve(process.cwd(), '.cromwell/admin/configs/public-env.json');
  res.status(200).json(readJsonSync(configPath));
}
