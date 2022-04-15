const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const axios = require('axios');
const sharp = require('sharp');
const { sendError } = require('../../util/error');
const { getImage } = require('../../util/image');

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

router.get('/:id', [api_limiter], async (req, res) => {
    let id = req.params.id;
    if (id.split('.').length > 1) {
        id = id.split('.')[0];
    }

    const query = req.query;

    if (!id) return sendError(res, 'image_not_found');

    const img_url = getImage(id);
    if (!img_url) return sendError(res, 'image_not_found');
    const img_fetch = await axios.get(img_url, {
        responseType: 'arraybuffer',
    });
    const img_buffer = Buffer.from(img_fetch.data, 'utf-8');

    res.header('Content-Type', 'image/png');
    res.header('Cross-Origin-Resource-Policy', 'same-site');

    if (
        !query ||
        !query.size ||
        (query.size && query.size.toLowerCase() === 'large')
    ) {
        const buffer = await sharp(img_buffer)
            .resize({ width: 960 })
            .toBuffer();
        const img = Buffer.from(buffer);

        res.header('Content-Length', img.length);
        return res.end(img);
    }

    if (query.size.toLowerCase() === 'original') {
        res.header('Content-Length', img_buffer.length);
        return res.end(img_buffer);
    }

    if (query.size.toLowerCase() === 'medium') {
        const buffer = await sharp(img_buffer)
            .resize({ width: 480 })
            .toBuffer();
        const img = Buffer.from(buffer);

        res.header('Content-Length', img.length);
        return res.end(img);
    }

    if (query.size.toLowerCase() === 'small') {
        const buffer = await sharp(img_buffer)
            .resize({ width: 240 })
            .toBuffer();
        const img = Buffer.from(buffer);

        res.header('Content-Length', img.length);
        return res.end(img);
    }
});

module.exports = router;
