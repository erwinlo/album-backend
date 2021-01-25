const express = require('express');
const router = express.Router();

/* List photos */
router.post('/', (req, res) => {
     const fs = require('fs')
     const path = require('path')
     const hasha = require('hasha')
     const utils = require('../utils')
     const variables = require('../variables')

     const skip = parseInt(req.body.skip) || 0;
     const limit = parseInt(req.body.limit) || 10;

     let documents = [];

     const url = req.protocol + '://' + req.get('host') + variables.PHOTOS_URL
     let albumsPath = path.join(__dirname, '..', variables.ALBUMS_DIR)
     fs.readdirSync(albumsPath).map((album) => {
          albumDir = albumsPath + '/' + album

          if (fs.statSync(albumDir).isDirectory()) {
               fs.readdirSync(albumDir).map((file) => {
                    documents.push({
                         id: hasha(albumDir + file, { algorithm: 'md5' }),
                         album: utils.capitalize(album),
                         name: file,
                         path: variables.ALBUMS_DIR + '/' + utils.capitalize(album) + '/' + file,
                         raw: url + '/' + album + '/' + file
                    })
               })
          }
     })

     // sort documents based on id
     documents.sort((a, b) => a.id.localeCompare(b.id))

     res.send({
          message: 'OK',
          documents: documents.slice(skip, limit + skip),
          count: documents.length,
          skip: skip,
          limit: limit
     });
});

module.exports = router;
