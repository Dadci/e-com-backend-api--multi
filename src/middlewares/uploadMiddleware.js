const multer = require('multer');
const path = require('path');
const { randomUUID } = require('node:crypto');


const storage = multer.diskStorage({

    //destination to store the files

    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'uploads'));
    },

    //filename to store the files

    filename: (req, file, cb) => {
        const extention = path.extname(file.originalname).toLowerCase();
        const uniqueName = randomUUID() + extention;
        cb(null, uniqueName);
    },

});

const fileFilter = (req, file, cb) => {

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {

        cb(null, true);
    } else {
        const error = new Error('Only JPEG, PNG and JPG files are allowed');
        error.code = 'UNSUPPORTED_IMAGE_TYPE';
        cb(error);
    }


};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 2, // 2MB
    }
})


module.exports = upload;