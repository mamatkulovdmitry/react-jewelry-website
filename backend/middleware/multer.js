import multer from "multer";

const storage = multer.diskStorage({
    filename: function (request, file, callback) {
        callback(null, file.originalname);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 50 * 1024 * 1024,
        files: 4,
    },
    fileFilter: (request, file, callback) => {
        if (file.mimetype.startsWith("image/")) {
            callback(null, true);
        } else {
            callback(new Error("Можно загружать только изображения!"), false);
        }
    },
});

export default upload;