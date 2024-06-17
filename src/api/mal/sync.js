var express = require('express');
var router = express.Router();
const axios = require('axios');

/**
 * @swagger
 * /mal/sync/anime/{anime_id}:
 *   put:
 *     summary: Update anime status on MyAnimeList
 *     tags: 
 *       - MyAnimeList Sync
 *     parameters:
 *       - in: path
 *         name: anime_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The anime ID
 *       - in: header
 *         name: mal_token
 *         schema:
 *           type: string
 *         required: true
 *         description: The MyAnimeList token
 *       - in: body
 *         name: animeStatusUpdateData
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               description: The new status of the anime
 *             score:
 *               type: integer
 *               description: The new score of the anime
 *         required: true
 *         description: The anime status update data
 *     responses:
 *       200:
 *         description: The anime status was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The updated status of the anime
 *                 score:
 *                   type: integer
 *                   description: The updated score of the anime
 *       500:
 *         description: An error occurred while updating the anime status on MyAnimeList
 */
router.put('/anime/:anime_id', function(req, res) {
    const anime_id = req.params.anime_id;
    const token = req.headers.mal_token;
    const animeStatusUpdateData = req.body;
  
    axios.put(`https://api.myanimelist.net/v2/anime/${anime_id}/my_list_status`, animeStatusUpdateData, {
      headers: {
          'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      res.status(500).json({ error: 'An error occurred while updating the anime status on MyAnimeList' });
    });
  });

module.exports = router;