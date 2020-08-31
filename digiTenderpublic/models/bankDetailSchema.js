const mongoose = require("mongoose");
const bankDetailsSchema = new mongoose.Schema({
  bankName: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  accountNo: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  accountType: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  branchCode: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
});

const BankDetails = mongoose.model("BankDetail", bankDetailsSchema);

module.exports = BankDetails;
