var express = require('express');
var router = express.Router();

/* Send health check */
router.get('/', (req, res) => {
  res.send({ message: 'OK' });
});

module.exports = router;
