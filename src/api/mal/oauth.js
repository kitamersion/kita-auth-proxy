var express = require('express');
var router = express.Router();
var qs = require('qs');
const axios = require('axios');

/**
 * @swagger
 * /mal/oauth/authorize:
 *   get:
 *     tags:
 *      - MyAnimeList OAuth2
 *     summary: Redirects to the MAL OAuth2 authorization page
 *     parameters:
 *       - in: query
 *         name: mal_client_id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: mal_challenge
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirect to the MAL OAuth2 authorization page
 */
router.get('/authorize', function(req, res) {
  const clientId  = req.query.mal_client_id;
  const challenge = req.query.mal_challenge;
  const scope = 'write:users';
  res.redirect(`https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${clientId}&code_challenge=${challenge}&code_challenge_method=plain&scope=${scope}`);
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
 *       - in: header
 *         name: mal_grant_type
 *         description: The grant type to use when exchanging the code for a token. Defaults to 'authorization_code'. Use 'refresh_token' to refresh the token.
 *         schema:
 *           type: string
 *           enum: [authorization_code, refresh_token]
 *           default: authorization_code
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
  const grantType     = req.headers.mal_grant_type || 'authorization_code';

  try {
    var response = await axios.post('https://myanimelist.net/v1/oauth2/token', qs.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
      grant_type: grantType,
      code_verifier: codeVerifier
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    res.status(200).json({
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      token_type: response.data.token_type,
      expires_in: response.data.expires_in
    });
  } catch (error) {
    res.status(500).json(res.data || { error: 'Error exchanging code for token' });
  }
});

module.exports = router;