const images = require('./../data/images.json');

function getImageID(url) {
    try {
        return url.split('/').slice(-1)[0].split('.')[0];
    } catch {
        return undefined;
    }
}

function imageExists(id) {
    for (const url of images.urls) {
        if (getImageID(url) === id) {
            return true;
        }
    }
}

function getImage(id) {
    for (const url of images.urls) {
        if (getImageID(url) === id) {
            return url;
        }
    }
    return null;
}

module.exports = {
    getImageID,
    imageExists,
    getImage,
};
