const jwt = require("jsonwebtoken");

const secretTokenKey = "dsakfjh237i8u0&&";
/*when db is set up use user id*/
const createToken = (email) => {
  return jwt.sign({ email }, secretTokenKey);
};

const verifyToken = async (token) => {
  try {
    jwt.verify(token, secretTokenKey);
    return true;
  } catch {
    return false;
  }
};

module.exports = { createToken, verifyToken };
