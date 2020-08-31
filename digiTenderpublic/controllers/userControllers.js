const bcrypt = require("bcrypt");

const _ = require("lodash");
const { User } = require("../models/userSchema");
const {
  joiSchema,
  validateUsingJoi,
} = require("../joiValidations/joiValidateUser");
const sendMail = require("../services/emailService");
const Customer = require("../models/customerSchema");
const Supplier = require("../models/supplierSchema");
const BankDetails = require("../models/bankDetailSchema");

const createUser = async (req, res) => {
  //joi schema
  const schema = {
    email: joiSchema.email,
    password: joiSchema.password,
    confirmPassword: joiSchema.confirmPassword,
  };

  const { error } = validateUsingJoi(req.body, schema);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user)
    return res.status(404).send("User already registered kindly login ");

  if (req.body.password !== req.body.confirmPassword)
    return res.status(400).send("password mismatch");

  const salt = await bcrypt.genSalt(5);
  req.body.password = await bcrypt.hash(req.body.password, salt);
  user = new User({
    email: req.body.email,
    password: req.body.password,
  });
  await user.save();
  return res.send({
    _id: user._id,
    email: user.email,
    message: "user successfully registered",
  });
};
module.exports.createUser = createUser;

const userAuthentication = async (req, res) => {
  const schema = {
    email: joiSchema.email,
    password: joiSchema.password,
  };

  const { error } = validateUsingJoi(req.body, schema);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  if (!user.isVerified)
    return res.status(200).send({
      registerationCompleted: user.isVerified,
      message: "registeration process incomplete",
    });
  if (!user.registerationStatus) {
    return res.status(200).send({
      registerationCompleted: user.registerationStatus,
      message: "registeration process incomplete",
    });
  }

  if (!user.bankDetailsStatus) {
    res.status("404").send("bank details not uploaded");
  }

  if (!user.isApproved) res.status("404").send("profile not yet approved");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");

  const token = user.generateAuthToken();
  return res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send({
      registerationCompleted: user.isVerified && user.registerationStatus,
      profileType: user.profileType,
      message: "logged in successfully",
    });
};
module.exports.userAuthentication = userAuthentication;

const otpGeneration = async (req, res) => {
  const schema = {
    email: joiSchema.email,
  };

  const { error } = validateUsingJoi(req.body, schema);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status("404").send("user not registered");
  }
  user.isVerified = false;
  let otpGenerated = Math.floor(1000 + Math.random() * 9000);

  const salt = await bcrypt.genSalt(5);
  const hashedOtp = await bcrypt.hash(otpGenerated.toString(), salt);

  user.otp = hashedOtp;

  user = await user.save();

  await sendMail(
    req.body.email,
    "otp for digiTender Verification",
    `your otp for digitender verification is ${otpGenerated}`
  );
  return res.status(200).send("otp sent on your email for verification");
};

module.exports.otpGeneration = otpGeneration;

const otpVerification = async (req, res) => {
  const schema = {
    email: joiSchema.email,
    otp: joiSchema.otp,
  };

  const { error } = validateUsingJoi(req.body, schema);
  if (error) return res.status(400).send(error.details[0].message);

  var user = await User.findOne({ email: req.body.email });

  if (user) {
    user.isVerified = false;
    const validOtp = await bcrypt.compare(req.body.otp, user.otp);
    if (validOtp) {
      user.isVerified = true;
      user = await user.save();
      const token = user.generateAuthToken();
      return res
        .header("x-auth-token", token)
        .header("access-control-expose-headers", "x-auth-token")
        .send({
          isregistered: user.registerationStatus,
          profileType: user.profileType,
          message: "user verified successfully",
        });
    } else return res.status(400).send("otp mismatch");
  } else return res.status(400).send("you are not a registered user");
};
module.exports.otpVerification = otpVerification;

const resetPassword = async (req, res) => {
  //joi schema
  const schema = {
    password: joiSchema.password,
    confirmPassword: joiSchema.confirmPassword,
  };

  const { error } = validateUsingJoi(req.body, schema);
  if (error) return res.status(400).send(error.details[0].message);

  if (req.body.password !== req.body.confirmPassword)
    return res.status(400).send("password mismatch");

  let user = await User.findById(req.user._id);
  if (!user) return res.status(404).send("User not Registered");

  if (!user.isVerified) return res.status(404).send("User not verified yet");

  const salt = await bcrypt.genSalt(5);
  req.body.password = await bcrypt.hash(req.body.password, salt);
  user.password = req.body.password;
  await user.save();
  const token = user.generateAuthToken();
  return res.header("x-auth-token", token).send({
    profileType: user.profileType,
    message: "password reset successfully",
  });
};
module.exports.resetPassword = resetPassword;

const registeration = async (req, res) => {
  res.send("registered successfully");
};

module.exports.registeration = registeration;

const setUpProfile = async (req, res) => {
  let user = await User.findById(req.user._id);
  if (!user) return res.status(404).send("User not Registered");

  if (user.isVerified === false) {
    res.status("404").send("User not verified");
  }
  if (user.registerationStatus)
    res.status(200).send({
      bankDetailsStatus: user.bankDetailsStatus,
      message: "Profile details already submitted",
    });

  user.profileType = req.body.profileType;

  let newEntry;
  if (req.body.profileType.toLowerCase() === "customer") {
    newEntry = new Customer(
      _.pick(req.body, [
        "organisationType",
        "firstName",
        "lastName",
        "idNumber",
        "contactNumber",
        "companyName",
        "entityRegistrationNo",
        "vatRegistration",
        "vatNumber",
        "tradingAs",
        "website",
        "physicalAddress",
        "postalAddress",
        "contactPerson",
        "contactNo",
      ])
    );
  }
  if (req.body.profileType.toLowerCase() === "supplier") {
    newEntry = new Supplier(
      _.pick(req.body, [
        "organisationType",
        "firstName",
        "lastName",
        "idNumber",
        "contactNumber",
        "companyName",
        "entityRegistrationNo",
        "vatRegistration",
        "vatNumber",
        "tradingAs",
        "website",
        "physicalAddress",
        "postalAddress",
        "contactPerson",
        "contactNo",
      ])
    );
  }
  newEntry.user = req.user._id;

  newEntry = await newEntry.save();
  user.details = newEntry._id;
  user.registerationStatus = true;
  await user.save();

  return res.send({
    profileType: user.profileType,
    message: `${user.profileType} registered successfully`,
  });
};

module.exports.setUpProfile = setUpProfile;

//controller of adding banking details
const addBankDetails = async (req, res) => {
  let user = await User.findById(req.user._id);
  if (!user) return res.status(404).send("User not Registered");

  if (user.isVerified === false) {
    res.status("404").send("User not verified");
  }

  let bankDetails = new BankDetails(
    _.pick(req.body, ["bankName", "accountNo", "accountType", "branchCode"])
  );
  bankDetails = await bankDetails.save();
  user.bankDetails = bankDetails._id;
  user.bankDetailsStatus = true;
  await user.save();

  return res.send({
    message: `${user.profileType} bank details uploaded successfully`,
  });
};
module.exports.addBankDetails = addBankDetails;

const tokenCheck = async (req, res) => {
  console.log("in token check");
  console.log(req.user._id);
  res.send("token verifired");
};

module.exports.tokenCheck = tokenCheck;

const myData = async (req, res) => {
  let user = await User.findById(req.user._id)
    .populate("bankDetails")
    .populate({
      path: "details",
      model: "Customer",
      populate: {
        path: "tenders",
        model: "Tender",
      },
    });
  if (!user) return res.status(404).send("User not Registered");

  if (user.isVerified === false) {
    res.status("404").send("User not verified");
  }

  if (!user.registerationStatus)
    res.status("404").send("registration process incomplete");

  if (!user.bankDetailsStatus)
    res.status("404").send("bank details not uploaded");

  if (!user.isApproved) res.status("404").send("profile not yet approved");

  return res.send({
    user: user,
    profileType: user.profileType,
    message: `welcome ${user.details.firstName}`,
  });
};
module.exports.myData = myData;

const changePassword = async (req, res) => {
  //joi schema
  const schema = {
    oldPassword: joiSchema.password,
    newPassword: joiSchema.newPassword,
    confirmNewPassword: joiSchema.confirmPassword,
  };
  //input validation
  const { error } = validateUsingJoi(req.body, schema);
  if (error) return res.status(400).send(error.details[0].message);

  if (req.body.password !== req.body.confirmPassword)
    return res.status(400).send("password mismatch");

  //check whether user registered or not
  let user = await User.findById(req.user._id);
  if (!user) return res.status(404).send("User not Registered");

  //check wheter user verified and registered
  if (!user.isVerified || !user.registerationStatus) {
    return res.status(404).send("User not verified or registered yet");
  }

  //check whether old password is valid or not
  const validPassword = await bcrypt.compare(
    req.body.oldPassword,
    user.password
  );
  if (!validPassword) return res.status(400).send("Invalid old password");

  //update password
  const salt = await bcrypt.genSalt(5);
  req.body.newPassword = await bcrypt.hash(req.body.newPassword, salt);
  user.password = req.body.newPassword;
  await user.save();
  return res.send({
    message: "password changed successfully",
  });
};
module.exports.changePassword = changePassword;
