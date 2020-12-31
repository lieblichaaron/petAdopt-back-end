const jwt = require("jsonwebtoken");
const currentDate = Date.now().valueOf() / 1000;
const secretTokenKey = process.env.JWT_SECRET_KEY;
/*when db is set up use user id*/
const createToken = (user) => {
  return jwt.sign(user, secretTokenKey, { expiresIn: "3d" });
};

const verifyToken = async (token) => {
  try {
    const payload = await jwt.verify(token, secretTokenKey);
    if (payload.exp < currentDate) {
      throw new Error("token expired");
    }
    return payload;
  } catch {
    return false;
  }
};

module.exports = { createToken, verifyToken };
