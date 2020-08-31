const startupDebugger = require("debug")("app:startup");
const express = require("express");
const app = express();
const morgan = require("morgan");
const api = require("./api/api.js");
var cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //for parsing body of HTML Forms
app.use("/public", express.static("public")); //for serving static contenct in public folder
if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  startupDebugger("morgan enabled");
}
app.use("/api", api); //handles all the apis

app.get("/", (req, res) => {
  res.send("welcome to digi tender");
});

module.exports = app;
