const mongoose = require("mongoose");

const dbConnect = () => {
  mongoose
    .connect("mongodb://localhost/digiTender", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("connected to database"))
    .catch((err) => console.log("could not connect to database", err));
};

module.exports = dbConnect;
