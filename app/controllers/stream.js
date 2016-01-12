'use strict';

const fs = require('fs');
const torrentStream = require('torrent-stream');
const torrent = require('../services/torrent');
const nt = require('nt');

exports.find = (req, res, next) => {
    let file = req.body.file;

    if (file.indexOf('.torrent') === -1) {
        return res.status(200).json({ magnet: file });
    }

    nt.read(file, (err, tor) => {
        if (err) {
            return res.status(500).json({ err: err });
        }

        let magnet = torrent.magnetize({
            name: tor.metadata.info.name,
            hash: tor.infoHash()
        });

        return res.status(200).json({ magnet: magnet });
    });
}

exports.index = (req, res) => {
    let magnet = req.url.replace('/?', '');

    let engine = torrentStream(magnet);

    engine.on('ready', () => {

        let file = engine.files.filter(file => file.name.indexOf('.mp4') !== -1)[0];

        let movieFileName = file.name;
        let extension = movieFileName.replace(/.*\./, '');
        let contentType = null;

        switch (extension) {
            case 'ogg':
                contentType = 'video/ogg';
                break;
            case 'webm':
                contentType = 'video/webm';
                break;
            case 'mp4':
                contentType = 'video/mp4';
                break;
        }

        if (!contentType) {
            engine.destroy();
            return res.status(400).end();
        }

        console.log(`filename: ${file.name}`);
        let total = file.length;

        // Chunks based streaming
        if (req.headers.range) {
            let range = req.headers.range;
            let parts = range.replace(/bytes=/, "").split("-");
            let partialstart = parts[0];
            let partialend = parts[1];

            let start = parseInt(partialstart, 10);
            let end = partialend ? parseInt(partialend, 10) : total - 1;
            let chunksize = (end - start) + 1;

            res.status(206);
            res.set('Content-Range', `bytes ${start}-${end}/${total}`);
            res.set('Accept-Ranges', 'bytes');
            res.set('Content-Length', chunksize);
            res.set('Content-Type', contentType);

            let stream = file.createReadStream({
                start: start,
                end: end
            });

            stream.pipe(res);
        } else {
            res.status(200);
            res.set('Content-Length', total);
            res.set('Content-Type', contentType);
            file.createReadStream().pipe(res);
        }

        res.on('close', () => {
            engine.destroy();
            console.log('Engine destroy');
        });

        res.on('finish', () => {
            engine.destroy();
            console.log('Engine destroy');
        });

    });

};
