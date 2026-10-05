const multer = require('multer');


const uploadErrorMiddleware = (err, req, res, next) => {

    if (res.headersSent) {
        return next(err);
    }

    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({
                message: 'Image must not exceed 2 MiB',
            });
        }

        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                message: 'Upload one file using the field name "image"',
            });
        }

        return res.status(400).json({
            message: 'Invalid upload request',
        });
    }

    if (err.code === 'UNSUPPORTED_IMAGE_TYPE') {
        return res.status(400).json({
            message: err.message,
        });
    }

    return next(err);

}

module.exports = uploadErrorMiddleware;