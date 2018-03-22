import * as express from 'express';
import * as path from 'path';
import * as cors from 'cors';
import ytdl = require('ytdl-core');

const app = express();
const contentLengthKey = 'content-length';

app.use(cors({
  origin: 'http://localhost:8080',
  exposedHeaders: ['content-length'],
}));

app.get('/audio', (req, res) => {
  try {
    res.contentType('audio/mp4');
    const result = ytdl(req.query.url, {
      filter: 'audioonly',
      requestOptions: {

      },
    })
      .on('response', response => {
        res.writeHead(200, { [contentLengthKey]: response.headers[contentLengthKey] });
        result.pipe(res);
      })
      .on('progress', (chunkLength, totalDownloaded, totalDownloadLength) => {
      });
  } catch (error) {
    res.status(500);
    res.send();
  }
});

app.use('/', express.static(path.join(__dirname, '../public')));

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`server listening on ${port}.`));
