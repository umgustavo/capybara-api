const router = require('express').Router();

router.get('/ping', (req, res) => {
    res.sendStatus(200);
});

router.use('/image/random', require('./image/random'));
router.use('/image', require('./image/id'));
router.use('/facts/random', require('./facts/random'));

module.exports = router;
