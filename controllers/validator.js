const { checkPassword } = require("../utils/passwordEncrypt");
const { body, validationResult } = require("express-validator");
const { verifyToken } = require("../utils/auth");
const User = require("../models/userModel");
const userInstance = new User();

const checkUser = async (req, res, next) => {
  const token = req.cookies.jwt;
  const payload = await verifyToken(token);
  if (!payload) {
    res.status(401).json(JSON.stringify("token expired"));
  } else {
    const user = await userInstance.findById(payload.userId);
    if (user) {
      next();
    } else {
      res
        .status(401)
        .json(JSON.stringify("Must be signed in before adopting a pet"));
    }
  }
};
const checkAdminStatus = async (req, res, next) => {
  const token = req.cookies.jwt;
  const payload = await verifyToken(token);
  if (!payload) {
    res.status(401).json(JSON.stringify("token expired"));
  } else {
    const user = await userInstance.findById(payload.userId);
    if (user.adminStatus) {
      next();
    } else {
      res
        .status(403)
        .json(JSON.stringify("Posting a pet is restricted to admins only"));
    }
  }
};
const validateUserInfo = [
  body("email")
    .isEmail()
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
    }),
  body("password").isLength({ min: 6 }),
  body("fullName").exists(),
  body("phoneNumber").isMobilePhone(),
];
const validateFieldNumber = (numOfExpectedKeys) => {
  return (req, res, next) => {
    if (Object.keys(req.body) > numOfExpectedKeys) {
      throw new Error("Invalid field added");
    } else {
      next();
    }
  };
};

const validateUserLogin = [
  body("email").isEmail(),
  body("password").exists(),
  body("password").custom(async (value, { req }) => {
    const user = await userInstance.findByField("email", req.body.email);
    if (!user) {
      throw new Error("No account exists with that email");
    }
    if (checkPassword(value, user.password)) {
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
    errors.array().forEach((error) => {
      errorMessage = error.msg;
    });
    res.status(400).json({ error: errorMessage });
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
};
