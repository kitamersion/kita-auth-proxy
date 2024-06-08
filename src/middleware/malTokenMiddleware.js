function requireMalToken(req, res, next) {
    const malToken = req.headers.mal_token;

    if (!malToken) {
        return res.status(403).send({ error: 'No mal_token provided in the header.' });
    }

    next();
}

module.exports = requireMalToken;