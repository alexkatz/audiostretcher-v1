"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const cors = require("cors");
const ytdl = require("ytdl-core");
const app = express();
app.use(cors({ origin: 'http://localhost:8080' }));
app.get('/audio', (req, res) => {
    try {
        res.contentType('audio/mp4');
        ytdl(req.query.url, {
            filter: 'audioonly',
        }).pipe(res);
    }
    catch (error) {
        console.log('error getting audio', error);
        res.status(500);
        res.send();
    }
});
app.use('/', express.static(path.join(__dirname, '../public')));
app.listen(3001, () => console.log('server listening on 3001.'));
//# sourceMappingURL=server.js.map