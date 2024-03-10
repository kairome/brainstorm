import express, { Express, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import _ from 'lodash';
import cors from 'cors';

import { expressjwt } from 'express-jwt';

import routes from './routes';
import { SECRET_KEY } from '@/config';
import fileUpload from 'express-fileupload';

import 'express-async-errors';

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
  }).unless({ path: /(auth\/*)|(boards\/public\/*)/ })
);

_.forEach(routes, (router, key) => {
  app.use(`/api/${key}`, router);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send();
    next(err);
    return;
  }

  console.error('Internal server error: ', err);
  res.status(500).json({ message: 'Server error.' });
  next(err);
});

app.get('/ping', async (req: Request, res: Response) => {
  res.send('pong');
});

export default app;
