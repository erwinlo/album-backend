const express = require('express');
const router = express.Router();
const fs = require('fs')
const path = require('path')
const { ALBUMS_DIR, PHOTOS_URL } = require('../variables');

/********* Upload *********/
router.put('/', (req, res) => {
     const { IncomingForm } = require('formidable');
     const { capitalize } = require('../utils');
     const url = req.protocol + '://' + req.get('host') + PHOTOS_URL

     let data = [];
     let album = '';
     let albumsDir = path.join(__dirname, '..', ALBUMS_DIR);

     new IncomingForm({ multiples: true }).parse(req)
          .on('field', (name, value) => {
               if (name === 'album') {
                    album = value.toLowerCase();

                    // create album directory if it doesn't exist
                    if (!fs.existsSync(path.join(albumsDir, album))) {
                         fs.mkdir(path.join(albumsDir, album), { recursive: true },
                              (err) => {
                                   if (err) throw err;
                              }
                         )
                    }
               }
          })
          .on('fileBegin', function (name, file) {
               file.path = path.join(albumsDir, album, file.name);
          })
          .on('file', function (name, file) {
               data.push({
                    album: capitalize(album),
                    name: file.name,
                    path: ALBUMS_DIR + '/' + album + '/' + file.name,
                    raw: url + '/' + album + '/' + file.name
               })
          })
          .once('end', () => {
               res.send({
                    message: 'OK',
                    data: data
               });
          });
});

/********* Delete a Photo *********/
router.delete('/:album/:fileName', (req, res) => {
     let file = path.join(__dirname, '..', ALBUMS_DIR, req.params.album, req.params.fileName);

     if (fs.existsSync(file)) {
          fs.unlinkSync(file);

          res.send({
               message: 'OK'
          });
     } else {
          res.status(404).send({ message: 'File not found.' })
     }
});

/********* Delete Multiple Photos *********/
router.delete('/', (req, res) => {
     const photos = req.body || [];

     photos.map((photo) => {
          album = path.join(__dirname, '..', ALBUMS_DIR, photo.album.toLowerCase());
          files = photo.documents.split(',');
          files.map((file) => {
               file = path.join(album, file);
               if (fs.existsSync(file)) fs.unlinkSync(file);
          });
     });

     res.send({
          message: 'OK'
     });
});

module.exports = router;
