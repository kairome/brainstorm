import express from 'express';
import path from 'path';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static('./dist'));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '/dist/index.html'));
});
app.listen(5173, () => {
  console.info('Serving frontend on http://localhost:5173');
});