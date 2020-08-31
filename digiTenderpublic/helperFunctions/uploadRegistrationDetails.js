const multer = require("multer");
const fs = require("fs");

function createUploadPathRegistrationDetails(req, res, next) {
  fs.exists(`./public/Documents/${req.user._id}/registerationDoc`, function (
    exists
  ) {
    if (exists) {
      next();
    } else {
      fs.mkdir(
        `./public/Documents/${req.user._id}/registerationDoc`,
        { recursive: true },
        function (err) {
          if (err) {
            console.log("Error in folder creation");
            next();
          }
          next();
        }
      );
    }
  });
}
module.exports.createUploadPathRegistrationDetails = createUploadPathRegistrationDetails;

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./public/Documents/${req.user._id}/registerationDoc`);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var uploadRegistrationDetails = multer({ storage: storage });

module.exports.uploadRegistrationDetails = uploadRegistrationDetails;
