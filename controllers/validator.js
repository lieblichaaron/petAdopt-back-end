const { checkPassword } = require("../utils/passwordEncrypt");
const { body, validationResult } = require("express-validator");
const { verifyToken } = require("../utils/auth");

const checkAdminStatus = async (req, res, next) => {
  const token = req.cookies.jwt;
  const payload = await verifyToken(token);
  const id = JSON.stringify(payload.userId);
  /*check that user with id is admin if false throw Error*/
  next();
};
const validateUserSignup = [
  body("email").isEmail(),
  // body("email").custom((value, { req }) => {

  //   if (value === /*another email in the db*/) {
  //     throw new Error("An account already exists with that email");
  //   }
  //   return true;
  // }),
  body("password").isLength({ min: 6 }),
  body("fullName").exists(),
  body("phoneNumber").isMobilePhone(),
];

const validateUserLogin = [
  body("email").isEmail(),
  body("password").exists(),
  // body("password").custom((value, { req }) => {
  //   /*check that email exists in database if not throw new Error("That email address does not exist")*/
  //   /* get encrypted password assosiated with req.body.email from db*/
  //   if (checkPassword(value, hash)) {
  //     return true;
  //   } else {
  //     throw new Error("Email or password is incorrect");
  //   }
  // }),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  validateUserSignup,
  validateUserLogin,
  handleValidationErrors,
  checkAdminStatus,
};
