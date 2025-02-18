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

module.exports = {
  image: generateFilter({
    allowedMimeTypes: ["image/png", "image/jpeg"],
  }),
};
