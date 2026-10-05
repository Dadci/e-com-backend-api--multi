const { unlink } = require('node:fs/promises');

const removeUploadedFile = async (file) => {
    if (!file?.path) {
        return;
    }

    try {
        await unlink(file.path);
    } catch (error) {
        if (error.code !== 'ENOENT') {
            console.error(
                'Could not remove uploaded file:',
                error.message
            );
        }
    }
};

module.exports = removeUploadedFile;