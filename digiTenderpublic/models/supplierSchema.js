const mongoose = require("mongoose");
const supplierSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  organisationType: {
    type: String,
    required: true,
    enum: ["government", "private limited"],
  },
  firstName: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  lastName: {
    type: String,
    minlength: 5,
    maxlength: 50,
  },
  idNumber: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  contactNumber: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  companyName: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  entityRegistrationNo: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  vatRegistration: {
    type: Number,
    required: true,
    enum: [1, 2],
  },
  vatNumber: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  tradingAs: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  website: {
    type: String,
    minlength: 5,
    maxlength: 50,
  },
  physicalAddress: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  postalAddress: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  contactPerson: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  contactNo: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  tenders: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Tender",
  },
});

const Supplier = mongoose.model("Supplier", supplierSchema);

module.exports = Supplier;
