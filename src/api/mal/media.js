var express = require('express');
var router = express.Router();
const axios = require('axios');

const makeRequest = (url, token) => {
  return axios.get(url, {
    headers: {
        'Authorization': `Bearer ${token}`
    }
  });
}

/**
 * @swagger
 * /mal/media/anime:
 *   get:
 *     tags:
 *      - MyAnimeList Media
 *     summary: Retrieve a list of anime by query
 *     description: Retrieve a list of anime from MyAnimeList API based on a query. The number of anime returned is limited by the limit query parameter.
 *     parameters:
 *       - in: header
 *         name: mal_token
 *         required: true
 *         description: The MyAnimeList API token.
 *         schema:
 *           type: string
 *       - in: query
 *         name: q
 *         required: true
 *         description: The search query to find anime.
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         description: The number of anime to return. Defaults to 4.
 *         schema:
 *           type: integer
 *           default: 4
 *     responses:
 *       200:
 *         description: A list of anime
 *       400:
 *         description: No query provided
 *       500:
 *         description: An error occurred while fetching data from MyAnimeList API
 */
router.get('/anime', function(req, res) {
  const token = req.headers.mal_token;
  const q = req.query.q;
  const limit = req.query.limit ?? 4;

  if (!q) {
    return res.status(400).json({ error: 'No query provided' });
  }

  const url = `https://api.myanimelist.net/v2/anime?q=${q}&limit=${limit}`;

  makeRequest(url, token)
  .then(response => {
    res.json(response.data);
  })
  .catch(error => {
    console.log(error)
    res.status(500).json({ error: 'An error occurred while fetching data from myanimelist API' });
  });
});

/**
 * @swagger
 * /mal/media/anime/{anime_id}:
 *   get:
 *     tags:
 *      - MyAnimeList Media
 *     summary: Retrieve a specific anime by ID
 *     description: Retrieve a specific anime from MyAnimeList API by its ID.
 *     parameters:
 *       - in: header
 *         name: mal_token
 *         required: true
 *         description: The MyAnimeList API token.
 *         schema:
 *           type: string
 *       - in: path
 *         name: anime_id
 *         required: true
 *         description: The ID of the anime to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The anime
 *       500:
 *         description: An error occurred while fetching data from MyAnimeList API
 */
router.get('/anime/:anime_id', function(req, res) {
  const token = req.headers.mal_token;
  const anime_id = req.params.anime_id;

  const url = `https://api.myanimelist.net/v2/anime/${anime_id}?fields=id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,nsfw,created_at,updated_at,media_type,status,genres,my_list_status,num_episodes,start_season,broadcast,source,average_episode_duration,rating,pictures,background,related_anime,related_manga,recommendations,studios,statistics`;

  makeRequest(url, token)
  .then(response => {
    res.json(response.data);
  })
  .catch(error => {
    console.log(error)
    res.status(500).json({ error: 'An error occurred while fetching data from myanimelist API' });
  });
});

module.exports = router;