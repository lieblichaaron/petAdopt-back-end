const jwt = require("jsonwebtoken");

const secretTokenKey = "dsakfjh237i8u0&&";
/*when db is set up use user id*/
const createToken = (userId) => {
  return jwt.sign({ userId }, secretTokenKey);
};

const verifyToken = async (token) => {
  try {
    const payload = await jwt.verify(token, secretTokenKey);
    console.log(payload);
    return true;
  } catch {
    return false;
  }
};

module.exports = { createToken, verifyToken };
