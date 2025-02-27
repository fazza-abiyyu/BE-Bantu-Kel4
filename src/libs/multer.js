const multer = require("multer");

function generateFilter(props) {
  let { allowedMimeTypes } = props;
  return multer({
    fileFilter: (req, file, callback) => {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        const err = new Error(
          `Only ${allowedMimeTypes.join(", ")} allowrd to upload `
        );
        return callback(err, false);
      }
      return callback(null, true);
    },
    onError: (err, next) => {
      next(err);
    },
  });
}

function uploadFileCV(props) {
  let { allowedMimeTypes } = props;
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "docs/");
    },
    filename: (req, file, cb) => {
      const uniqueCode = Date.now(); 
      req.uniqueCode = uniqueCode; 
      cb(null, uniqueCode + "-" + file.originalname.replace(/\s+/g, "-"));
    },
  });
  return multer({
    fileFilter: (req, file, callback) => {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        const err = new Error(
          `Only ${allowedMimeTypes.join(", ")} allowed to upload!`
        );
        return callback(err, false);
      }
      callback(null, true);
    },
    storage: storage,
    onError: (err, next) => {
      next(err);
    },
  });
}

module.exports = {
  image: generateFilter({
    allowedMimeTypes: ["image/png", "image/jpeg"],
  }),
  document: uploadFileCV({
    allowedMimeTypes: ["application/pdf"],
  }),
};
