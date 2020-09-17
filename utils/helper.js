const btoa = require("btoa");
const _ = require("lodash");

class Helper {
    static imagesDataToSrc = (images) => {
        if (_.some(images)) {
            const _images = images.map(
                (img) =>
                    `data:image/png;base64,${btoa(
                        String.fromCharCode.apply(null, img.data)
                    )}`
            );
            
            return _images;
        } else return images;
    };
}

module.exports = Helper;
