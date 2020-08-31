const config = require("config");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  registerationStatus: {
    type: Boolean,
    required: true,
    default: false,
  },
  isApproved: {
    type: Boolean,
    required: true,
    default: false,
  },
  bankDetailsStatus: {
    type: Boolean,
    required: true,
    default: false,
  },
  email: {
    type: String,
    required: function () {
      if (
        (this.facebookId === null || this.facebookId === "") &&
        (this.googleId === null || this.googleId === "")
      )
        return true;
      return false;
    },
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  facebookId: {
    type: String,
    required: false,
    minlength: 5,
    maxlength: 255,
  },
  googleId: {
    type: String,
    required: false,
    minlength: 5,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  profileType: {
    type: String,
    required: true,
    enum: ["customer", "supplier"],
    default: "customer",
  },
  otp: {
    type: String,
    minlength: 5,
    maxlength: 1024,
  },
  isAdmin: { type: Boolean, required: true, default: false },
  isVerified: { type: Boolean, required: true, default: false },
  details: {
    type: mongoose.Schema.Types.ObjectId,
    ref: function () {
      if (this.profileType === "customer") return "Customer";
      if (this.profileType === "supplier") return "Supplier";
    },
  },
  bankDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BankDetail",
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
    },
    config.get("jwtprivatekey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

exports.User = User;
