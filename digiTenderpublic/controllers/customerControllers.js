const Tender = require("../models/tenderSchema");
const { User } = require("../models/userSchema");
const _ = require("lodash");

const createTender = async (req, res) => {
  req.body.itemList = JSON.parse(req.body.itemList);
  let user = await User.findById(req.user._id)
    .populate("details")
    .populate("tenders");
  if (!user) return res.status(404).send("User not Registered");

  if (user.isVerified === false) {
    res.status("404").send("User not verified");
  }
  if (user.registerationStatus === false) {
    res.status("404").send("registration process not completed yet");
  }
  if (user.bankDetailsStatus === false) {
    res.status("404").send("registration process not completed yet");
  }
  if (user.profileType.toLowerCase() !== "customer") {
    res.status("404").send("you are not a customer");
  }

  let newTender = new Tender(
    _.pick(req.body, [
      "closingDate",
      "deliveryDate",
      "budgetAmount",
      "deliveryLocation",
      "isPublished",
      "itemList",
    ])
  );
  newTender.createdBy = req.user._id;
  newTender = await newTender.save();

  user.details.tenders.push(newTender._id);

  await user.details.save();

  user = await User.findById(req.user._id).populate({
    path: "details",
    model: "Customer",
    populate: {
      path: "tenders",
      model: "Tender",
    },
  });

  return res.send({
    message: "tender uploaded successfully",
  });
};

module.exports.createTender = createTender;
