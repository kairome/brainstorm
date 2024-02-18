import express, { Express, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import _ from 'lodash';
import cors from 'cors';

import { expressjwt } from 'express-jwt';

import routes from './routes';
import { filesContainer, PORT, SECRET_KEY } from '@/config';
import fileUpload from 'express-fileupload';
import fs from 'fs';

import 'express-async-errors';
import { FileBuckets } from '@/types/files';

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(fileUpload());

app.use(cors({
  origin: /localhost/
}));

app.use(
  expressjwt({
    secret: SECRET_KEY,
    algorithms: ['HS256'],
  }).unless({ path: /auth\/*/ })
);

_.forEach(routes, (router, key) => {
  app.use(`/api/${key}`, router);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send();
  }

  console.error('Internal server error: ', err);
  res.status(500).json({ message: 'Server error.' });
  next(err);
});

app.get('/ping', async (req: Request, res: Response) => {
  res.send('pong');
});

app.listen(PORT, () => {
  console.info(`Server is running at http://localhost:${PORT}`);

  // create files buckets
  if (!fs.existsSync(filesContainer)) {
    console.info('Creating files container');
    fs.mkdirSync(filesContainer);
  }

  _.forEach(FileBuckets, (bucket) => {
    const bucketPath = `${filesContainer}/${bucket}`;
    if (!fs.existsSync(bucketPath)) {
      console.info(`Creating ${bucket} bucket`);
      fs.mkdirSync(bucketPath);
    }
  });

});
