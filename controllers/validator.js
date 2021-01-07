const { checkPassword } = require("../utils/passwordEncrypt");
const { check, body, validationResult } = require("express-validator");
const { verifyToken } = require("../utils/auth");
const User = require("../models/userModel");
const userInstance = new User();
const fs = require("fs");

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
    if (numOfExpectedKeys === 11) {
      if (
        Object.keys(req.body).length !== numOfExpectedKeys &&
        Object.keys(req.body).length !== numOfExpectedKeys - 1
      ) {
        res.status(400).json("All fields must be full");
      } else {
        next();
      }
    } else {
      if (Object.keys(req.body).length !== numOfExpectedKeys) {
        res.status(400).json("All fields must be full");
      } else {
        next();
      }
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

const validatePetInfo = [
  body("type")
    .isString()
    .withMessage("Type must contain only letters")
    .optional(),
  body("name")
    .isLength({ min: 1 })
    .withMessage("Name must contain characters")
    .optional(),
  body("adoptionStatus")
    .custom((value, { req }) => {
      const statusArray = ["Adopted", "Fostered", "Available"];
      if (statusArray.includes(value)) {
        return true;
      } else {
        throw new Error(`Adoptions status "${value}" is invalid`);
      }
    })
    .optional(),
  body("ownerId")
    .custom(async (value, { req }) => {
      const user = await userInstance.findById(value);
      if (!user) {
        fs.unlinkSync(req.file.path);
        throw new Error("OwnerId does not match any users");
      }
      return true;
    })
    .optional(),
  body("height").isInt().withMessage("Height must be a number").optional(),
  body("weight").isInt().withMessage("Weight must be a number").optional(),
  body("color")
    .isString()
    .withMessage("Color must be valid")
    .isLength({ min: 1 })
    .withMessage("Color must be valid")
    .optional(),
  body("hypoallergenic")
    .custom((value, { req }) => {
      if (typeof value === "boolean") {
        return true;
      } else {
        throw new Error("OwnerId does not match any users");
      }
    })
    .optional(),
  body("dietaryRestrictions")
    .isString()
    .withMessage("Dietary restriction invalid")
    .optional(),
  body("breedOfAnimal")
    .isString()
    .withMessage("Breed restriction invalid")
    .optional(),
  body("bio").isString().withMessage("Bio must be valid").optional(),
];
const sanitizePetInfo = async (req, res, next) => {
  req.body.data = JSON.parse(req.body.data);
  let newPetInfo = {};
  if ("type" in req.body.data) newPetInfo.type = req.body.data.type;
  if ("name" in req.body.data) newPetInfo.name = req.body.data.name;
  if ("adoptionStatus" in req.body.data)
    newPetInfo.adoptionStatus = req.body.data.adoptionStatus;
  if ("ownerId" in req.body.data) newPetInfo.ownerId = req.body.data.ownerId;
  if ("height" in req.body.data) newPetInfo.height = req.body.data.height;
  if ("weight" in req.body.data) newPetInfo.weight = req.body.data.weight;
  if ("color" in req.body.data) newPetInfo.color = req.body.data.color;
  if ("hypoallergenic" in req.body.data)
    newPetInfo.hypoallergenic = req.body.data.hypoallergenic;
  if ("dietaryRestrictions" in req.body.data)
    newPetInfo.dietaryRestrictions = req.body.data.dietaryRestrictions;
  if ("breedOfAnimal" in req.body.data)
    newPetInfo.breedOfAnimal = req.body.data.breedOfAnimal;
  if ("bio" in req.body.data) newPetInfo.bio = req.body.data.bio;
  req.body = newPetInfo;
  next();
};

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    if (errors.array().length === 1) {
      const errorMessage = errors.array()[0].msg;
      res.status(400).json(errorMessage);
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
  validatePetInfo,
  sanitizePetInfo,
};
