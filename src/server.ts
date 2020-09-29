import * as express from 'express';
import * as path from 'path';
import * as cors from 'cors';
import ytdl = require('ytdl-core');

const app = express();

app.use(
  cors({
    origin: 'http://localhost:8080',
    exposedHeaders: ['Content-Length'],
  }),
);

app.get('/audio', (req, res) => {
  try {
    const result = ytdl(req.query.url, { filter: 'audioonly' });
    result.on('response', response => {
      res.writeHead(200, {
        ['Content-Length']: response.headers['content-length'],
        'Content-Type': 'audio/mp4',
      });
      result.pipe(res);
    });
  } catch (error) {
    res.status(500);
    res.send();
  }
});

app.use('/', express.static(path.join(__dirname, '../public')));

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`server listening on ${port}.`));
