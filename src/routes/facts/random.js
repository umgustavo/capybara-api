const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const { getImageID, getImage } = require('../../util/image');
const facts = require('../../data/facts.json');
const { sendError } = require('../../util/error');

const api_limiter = rateLimit({
    message: {
        error: {
            message: 'Too many requests. Try again later',
        },
    },
    windowMs: 1000 * 60,
    max: 50,
    standardHeaders: false,
    legacyHeaders: false,
});

router.get('/', [api_limiter], async (req, res) => {
    const query = req.query;

    let lang = 'en_us';

    if (req.headers['accept-language']) {
        const langs = req.headers['accept-language'].split(',');
        for (let _lang of langs) {
            _lang = _lang.replaceAll('-', '_').toLowerCase();
            if (facts[_lang]) lang = _lang;
        }
    }

    if (query && query.lang) {
        const lang = query.lang.toLowerCase();
        if (!facts[lang]) return sendError(res, 'language_not_supported');
    }

    const fact = facts[lang][Math.floor(Math.random() * facts[lang].length)];
    res.json({
        fact: fact,
    });
});

module.exports = router;
