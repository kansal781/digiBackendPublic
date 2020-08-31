const express = require("express");
const router = express.Router();
const Supplier = require("../models/supplierSchema");
const { createSupplier } = require("../controllers/supplierControllers");
router.get("/", async (req, res) => {
  res.send("you are in suppliers resource");
});

module.exports = router;
