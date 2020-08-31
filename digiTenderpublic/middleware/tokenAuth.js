const jwt = require("jsonwebtoken");
const config = require("config");
function tokenAuthorisation(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    const decoded = jwt.verify(token, config.get("jwtprivatekey"));
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("you are not authenticated yet");
  }
}

module.exports = tokenAuthorisation;
