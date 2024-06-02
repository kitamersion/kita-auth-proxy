var express = require('express');
var router = express.Router();
var qs = require('qs');
const axios = require('axios');

router.post('/authorize', function(req, res) {
  var clientId = req.query.client_id;
  const challenge = req.query.challenge;
  res.redirect(`https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${clientId}&code_challenge=${challenge}&code_challenge_method=plain`);
});

router.get('/callback', function(req, res) {
  var code = req.query.code;
  res.redirect(`/mal/oauth/token?code=${code}`);
});

router.get('/token', async function(req, res) {
  var code = req.query.code;
  var clientId = process.env.CLIENT_ID;
  var clientSecret = process.env.CLIENT_SECRET;
  const codeVerifier = process.env.CHALLENGE;

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