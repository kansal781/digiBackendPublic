const multer = require("multer");
const fs = require("fs");

function createUploadPathBankDetails(req, res, next) {
  fs.exists(`./public/Documents/${req.user._id}/bankDoc`, function (exists) {
    if (exists) {
      next();
    } else {
      fs.mkdir(
        `./public/Documents/${req.user._id}/bankDoc`,
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
module.exports.createUploadPathBankDetails = createUploadPathBankDetails;

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./public/Documents/${req.user._id}/bankDoc`);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var uploadBankDetails = multer({ storage: storage });

module.exports.uploadBankDetails = uploadBankDetails;
