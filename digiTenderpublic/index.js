const config = require("config");
const dbConnect = require("./dbConnection");
const app = require("./app.js");

if (!config.get("jwtprivatekey")) {
  console.error("FATAL ERROR: jwtprivatekey is not defined");
  process.exit(1);
}
dbConnect();

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`listening on port ${port}...`));
