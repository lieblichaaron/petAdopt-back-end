const { checkPassword } = require("../utils/passwordEncrypt");
const { body, validationResult } = require("express-validator");
const { verifyToken } = require("../utils/auth");
const User = require("../models/userModel");
const userInstance = new User();

const checkUser = async (req, res, next) => {
  const token = req.cookies.jwt;
  const payload = await verifyToken(token);
  if (!payload) {
    res.status(401).send("token expired");
  } else {
    const user = await userInstance.findById(payload._id);
    if (user) {
      next();
    } else {
      res.status(401).send("Must be signed in before adopting a pet");
    }
  }
};
const checkAdminStatus = async (req, res, next) => {
  const token = req.cookies.jwt;
  const payload = await verifyToken(token);
  if (!payload) {
    res.status(401).send("token expired");
  } else {
    const user = await userInstance.findById(payload._id);
    if (user.adminStatus) {
      next();
    } else {
      res.status(403).send("Posting a pet is restricted to admins only");
    }
  }
};
const validateUserInfo = [
  body("email")
    .isEmail()
    .withMessage("Must be in email format")
    .custom(async (value, { req }) => {
      const user = await userInstance.findByField("email", value);
      let signingUp = true;
      if (req.cookies.jwt) {
        const token = req.cookies.jwt;
        payload = await verifyToken(token);
        if (user._id === payload.userId) {
          signingUp = false;
        }
      }
      if (user && signingUp) {
        throw new Error("An account already exists with that email");
      }
      return true;
    })
    .optional(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 chars long")
    .optional(),
  body("fullName")
    .isLength({ min: 1 })
    .withMessage("fullName must contain characters")
    .optional(),
  body("phoneNumber")
    .isMobilePhone()
    .withMessage("Must be phone number")
    .optional(),
];

const sanitizeUserInfo = async (req, res, next) => {
  let newUserInfo = {};
  if ("fullName" in req.body) newUserInfo.fullName = req.body.fullName;
  if ("phoneNumber" in req.body) newUserInfo.phoneNumber = req.body.phoneNumber;
  if ("email" in req.body) newUserInfo.email = req.body.email;
  if ("password" in req.body) newUserInfo.password = req.body.password;
  if ("bio" in req.body) newUserInfo.bio = req.body.bio;
  req.body = newUserInfo;
  next();
};
const validateFieldNumber = (numOfExpectedKeys) => {
  return (req, res, next) => {
    if (Object.keys(req.body).length < numOfExpectedKeys) {
      res.status(400).send("All fields must be full");
    } else {
      next();
    }
  };
};

const validateUserLogin = [
  body("email").isEmail().withMessage("Must be in email format"),
  body("password").custom(async (value, { req }) => {
    const user = await userInstance.findByField("email", req.body.email);
    if (!user) {
      throw new Error("No account exists with that email");
    } else if (checkPassword(value, user.password)) {
      return true;
    } else {
      throw new Error("Password does not match that email");
    }
  }),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    let errorMessage;
    if (errors.array().length === 1) {
      errorMessage = errors.array()[0].msg;
      res.status(400).json({ error: errorMessage });
    } else {
      res.status(400).json(errors.array());
    }
  } else {
    next();
  }
};

module.exports = {
  validateUserInfo,
  validateUserLogin,
  validateFieldNumber,
  handleValidationErrors,
  checkAdminStatus,
  checkUser,
  sanitizeUserInfo,
};
