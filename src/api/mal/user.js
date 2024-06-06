var express = require('express');
var router = express.Router();
const axios = require('axios');

router.get('/me', function(req, res) {
  const token = req.headers.authorization; // get the token from the request headers

  axios.get('https://api.myanimelist.net/v2/users/@me?fields=anime_statistics', {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': token
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