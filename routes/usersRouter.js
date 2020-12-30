const express = require("express");
const router = express.Router();
const fs = require("fs");
const {
  getUsers,
  getUserById,
  addNewUser,
  updateUserById,
  loginUser,
  loginUserWithToken,
  getUserPetsById,
} = require("../controllers/userCtrlr");

const {
  validateUserInfo,
  validateUserLogin,
  handleValidationErrors,
  checkUser,
  checkAdminStatus,
} = require("../controllers/validator");

/* fullName, email, password, phoneNumber */
router.post("/signup", validateUserInfo, handleValidationErrors, addNewUser);

/*email, password*/
router.post("/login", validateUserLogin, handleValidationErrors, loginUser);
router.get("/login/token", loginUserWithToken);

router.get("/:id/pets", getUserPetsById);

router.get("/:id", getUserById);

// (protected to logged in user)
router.put(
  "/:id",
  checkUser,
  validateUserInfo,
  handleValidationErrors,
  updateUserById
);

// (protected to admin)
router.get("/", checkAdminStatus, getUsers);

module.exports = router;
