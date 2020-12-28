const jwt = require("jsonwebtoken");

const secretTokenKey = process.env.JWT_SECRET_KEY;
/*when db is set up use user id*/
const createToken = (userId) => {
  return jwt.sign({ userId }, secretTokenKey);
};

const verifyToken = async (token) => {
  try {
    const payload = await jwt.verify(token, secretTokenKey);
    return payload;
  } catch {
    return false;
  }
};

module.exports = { createToken, verifyToken };
