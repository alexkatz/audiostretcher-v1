import * as express from 'express';
import * as path from 'path';
import * as cors from 'cors';
import ytdl = require('ytdl-core');

const app = express();

app.use(cors({ origin: 'http://localhost:8080' }));

app.get('/audio', (req, res, next) => {
  try {
    const { url } = req.query;
    res.contentType('audio/mp4');
    ytdl(url, {
      filter: 'audioonly',
    }).pipe(res);
  } catch (error) {
    console.log('error getting audio', error);
    res.status(500);
    res.send();
  }
});

app.use('/', express.static(path.join(__dirname, '../public')));

app.listen(3001, () => console.log('server listening on 3001.'));
