const multer = require("multer");
const fs = require("fs");

function createUploadPathTenderDocs(req, res, next) {
  fs.exists(`./public/Documents/${req.user._id}/TenderDocs`, function (exists) {
    if (exists) {
      next();
    } else {
      fs.mkdir(
        `./public/Documents/${req.user._id}/TenderDocs`,
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
module.exports.createUploadPathTenderDocs = createUploadPathTenderDocs;

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./public/Documents/${req.user._id}/TenderDocs`);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var uploadTender = multer({ storage: storage });

module.exports.uploadTender = uploadTender;
