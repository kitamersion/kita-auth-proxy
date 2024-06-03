var express = require('express');
var router = express.Router();

/**
 * @swagger
 * /health:
 *   get:
 *     tags:
 *       - Health Check
 *     summary: Checks if the server is running
 *     responses:
 *       200:
 *         description: Server is running
 */
router.get('/', function(req, res, next) {
  res.send('OK');
});

module.exports = router;