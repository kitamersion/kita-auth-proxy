var express = require('express');
var router = express.Router();
const axios = require('axios');

/**
 * @swagger
 * /mal/user/me:
 *   get:
 *     tags:
 *      - MyAnimeList User
 *     summary: Fetch user data from MyAnimeList using a token
 *     parameters:
 *       - in: header
 *         name: mal_token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 anime_statistics:
 *                   type: object
 *                   description: User's anime statistics
 *       500:
 *         description: An error occurred while fetching data from MyAnimeList API
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get('/me', function(req, res) {
  const token = req.headers.mal_token;

  axios.get('https://api.myanimelist.net/v2/users/@me?fields=anime_statistics', {
    headers: {
        'Authorization': `Bearer ${token}`
    }
  })
  .then(response => {
    res.json(response.data);
  })
  .catch(error => {
    res.status(500).json({ error: 'An error occurred while fetching data from myanimelist API' });
  });
});

module.exports = router;