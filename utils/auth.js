const jwt = require("jsonwebtoken");
const currentDate = Date.now().valueOf() / 1000;
const secretTokenKey = process.env.JWT_SECRET_KEY;
/*when db is set up use user id*/
const createToken = (userId) => {
  return jwt.sign({ userId }, secretTokenKey, { expiresIn: "3d" });
};

const verifyToken = async (token) => {
  try {
    const payload = await jwt.verify(token, secretTokenKey);
    if (payload.exp < currentDate) {
      throw new Error("token no longer valid");
    }
    return payload;
  } catch {
    return false;
  }
};

module.exports = { createToken, verifyToken };
