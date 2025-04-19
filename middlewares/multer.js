const multer = require("multer");
const fs = require("fs");

const mediaStore = multer.diskStorage({
    destination: async (req, file, cb) => {
        const dir = `./public/uploads/`;
        fs.stat(dir, (err) => {
            if (err && err.code === 'ENOENT') {
                fs.mkdir(dir, { recursive: true }, (mkdirErr) => {
                    if (mkdirErr) return cb(mkdirErr);
                    cb(null, dir);
                });
            } else {
                cb(null, dir);
            }
        });
    },
    filename: (req, file, cb) => {
        cb(
            null,
            file.fieldname +
            "_" +
            Date.now() +
            "_" +
            file.originalname.replace(/ /g, "_")
        );
    },
});
exports.uploadMedia = multer({
    storage: mediaStore,
    limits: {
        fileSize: 150 * 1024 * 1024, // 50 MB, (max file size)
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|svg/;
        const isAllowed = allowedTypes.test(file.mimetype);
        isAllowed ? cb(null, true) : cb(new Error('Only images are allowed'));
    },
});
