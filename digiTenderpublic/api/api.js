const express = require("express");
var multer = require("multer");
const router = express.Router();
const customerRoutes = require("../routes/customerRoutes");
const supplierRoutes = require("../routes/supplierRoutes");
const {
  createUser,
  userAuthentication,
  otpGeneration,
  otpVerification,
  resetPassword,
  registeration,
  setUpProfile,
  tokenCheck,
  myData,
  changePassword,
  addBankDetails,
} = require("../controllers/userControllers");
const tokenAuthorisation = require("../middleware/tokenAuth");
const {
  createUploadPathRegistrationDetails,
  uploadRegistrationDetails,
} = require("../helperFunctions/uploadRegistrationDetails");
const {
  createUploadPathBankDetails,
  uploadBankDetails,
} = require("../helperFunctions/uploadBankDetails");

router.get("/", function (req, res) {
  res.send("welcome to digi tender api");
});

router.post("/register", createUser);

router.post("/login", userAuthentication);
router.post("/otpGeneration", otpGeneration);
router.post("/forgotPassword", otpGeneration);

router.post("/otpVerification", otpVerification);
router.post("/tokenCheck", tokenAuthorisation, tokenCheck);
//api for setting up profile
router.post(
  "/setUpProfile",
  tokenAuthorisation,
  createUploadPathRegistrationDetails,
  uploadRegistrationDetails.any(),
  setUpProfile
);
//api for adding bank details
router.post(
  "/addBankDetails",
  tokenAuthorisation,
  createUploadPathBankDetails,
  uploadBankDetails.any(),
  addBankDetails
);
router.post("/resetPassword", tokenAuthorisation, resetPassword);
router.post("/changePassword", tokenAuthorisation, changePassword);
router.get("/myData", tokenAuthorisation, myData);

router.use("/customer", customerRoutes); //handle all requests to customer resource
router.use("/supplier", supplierRoutes); //handle all requests to supplier resoruce

module.exports = router;
