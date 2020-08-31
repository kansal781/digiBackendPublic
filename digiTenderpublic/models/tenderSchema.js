const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  unitOfMeasure: {
    type: String,
    required: true,
  },
});

const tenderSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Customer",
  },
  suppliedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: function () {
      if (!this.published) return false;
      if (this.status === "awarded" || this.status === "paid") {
        return true;
      } else false;
    },
    ref: "Supplier",
  },
  creationDate: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  closingDate: {
    type: Date,
    required: true,
  },
  deliveryDate: {
    type: Date,
    require: true,
  },
  budgetAmount: {
    type: Number,
    required: true,
  },
  deliveryLocation: {
    type: String,
    minlength: 5,
    maxlength: 50,
  },
  itemList: [{ type: itemSchema, required: true }],
  isPublished: {
    type: Boolean,
    default: false,
    required: true,
  },
  status: {
    type: String,
    enum: ["awarded", "paid", "inProcess", "cancelled", "pending"],
    required: function () {
      return this.isPublished;
    },
    default: function () {
      if (this.isPublished) {
        return "inProcess";
      } else return "pending";
    },
  },
});

const Tender = mongoose.model("Tender", tenderSchema);

module.exports = Tender;
