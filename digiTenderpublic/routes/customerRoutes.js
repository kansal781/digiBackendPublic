const express = require("express");
const tokenAuthorisation = require("../middleware/tokenAuth");
const {
  uploadTender,
  createUploadPathTenderDocs,
} = require("../helperFunctions/uploadTender");
const { createTender } = require("../controllers/customerControllers");

const router = express.Router();
router.get("/", async (req, res) => {
  res.send("you are in customers resource");
});

router.post(
  "/createTender",
  tokenAuthorisation,
  createUploadPathTenderDocs,
  uploadTender.any(),
  createTender
);

module.exports = router;
