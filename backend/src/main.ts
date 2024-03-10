import _ from 'lodash';
import { filesContainer, PORT } from '@/config';
import fs from 'fs';

import 'express-async-errors';
import { FileBuckets } from '@/types/files';
import app from '@/app';

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
