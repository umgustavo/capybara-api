const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const { getImageID, getImage } = require('../../util/image');
const images = require('../../data/images.json');

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
    const rand_img =
        images.urls[Math.floor(Math.random() * images.urls.length)];

    const img_id = getImageID(rand_img);

    const response = {
        id: img_id,
        storage_url: getImage(img_id),
        image_urls: {
            large: `${process.env.BASE_URL}/image/${img_id}?size=large`,
            medium: `${process.env.BASE_URL}/image/${img_id}?size=medium`,
            original: `${process.env.BASE_URL}/image/${img_id}?size=original`,
            small: `${process.env.BASE_URL}/image/${img_id}?size=small`,
        },
    };

    res.status(200).json(response);
});

module.exports = router;
