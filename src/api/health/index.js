var express = require('express');
var router = express.Router();

/* GET health */
router.get('/', function(req, res, next) {
  res.send('OK');
});

module.exports = router;
