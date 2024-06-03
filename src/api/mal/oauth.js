var express = require('express');
var router = express.Router();
var qs = require('qs');
const axios = require('axios');

/**
 * @swagger
 * /mal/oauth/authorize:
 *   post:
 *     tags:
 *      - MyAnimeList OAuth2
 *     summary: Redirects to the MAL OAuth2 authorization page
 *     parameters:
 *       - in: header
 *         name: mal_client_id
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: mal_challenge
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirect to the MAL OAuth2 authorization page
 */
router.post('/authorize', function(req, res) {
  const clientId  = req.headers.mal_client_id;
  const challenge = req.headers.mal_challenge;
  res.redirect(`https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${clientId}&code_challenge=${challenge}&code_challenge_method=plain`);
});

/**
 * @swagger
 * tags:
 *    - mal
 * /mal/oauth/callback:
 *   get:
 *     tags:
 *      - MyAnimeList OAuth2
 *     summary: Callback endpoint for MAL OAuth2
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns the authorization code
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 */
router.get('/callback', function(req, res) {
  var code = req.query.code;
  res.json({ code: code });
});

/**
 * @swagger
 * tags:
 *    - mal
 * /mal/oauth/token:
 *   get:
 *     tags:
 *      - MyAnimeList OAuth2
 *     summary: Exchanges the authorization code for an access and refresh token
 *     parameters:
 *       - in: header
 *         name: mal_code
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: mal_client_id
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: mal_client_secret
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: mal_code_verifier
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns the access token and related information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access_token:
 *                   type: string
 *                 refresh_token:
 *                   type: string
 *                 token_type:
 *                   type: string
 *                 expires_in:
 *                   type: integer
 *       400:
 *         description: Error exchanging code for token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get('/token', async function(req, res) {
  const code          = req.headers.mal_code;
  const clientId      = req.headers.mal_client_id;
  const clientSecret  = req.headers.mal_client_secret;
  const codeVerifier  = req.headers.mal_code_verifier;

  try {
    var response = await axios.post('https://myanimelist.net/v1/oauth2/token', qs.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
      grant_type: 'authorization_code',
      code_verifier: codeVerifier
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    res.json({
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      token_type: response.data.token_type,
      expires_in: response.data.expires_in
    });
  } catch (error) {
    res.json({ error: 'Error exchanging code for token' });
  }
});

module.exports = router;