const { body, validationResult } = require("express-validator");

const validateUserSignup = [
  body("email").isEmail(),
  //   body("email").custom((value, { req }) => {
  //     if (value === /*another email in the db*/) {
  //       throw new Error("An account already exists with that email");
  //     }
  //     return true;
  //   }),
  body("password").isLength({ min: 6 }),
  body("fullName").exists(),
  body("phoneNumber").isMobilePhone(),
];

const validateUserLogin = [body("email").isEmail(), body("password").exists()];

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
};
