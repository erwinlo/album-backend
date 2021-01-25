const fs = require('fs')

fs.mkdir('test/a/b/c', { recursive: true }, (err) => {
     if (err) throw err;
})