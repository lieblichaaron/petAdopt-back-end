const jwt = require("jsonwebtoken");

const secretTokenKey = "dsakfjh237i8u0&&";
/*when db is set up use user id*/
const createToken = (email) => {
  return jwt.sign({ email }, secretTokenKey);
};

module.exports = { createToken };
