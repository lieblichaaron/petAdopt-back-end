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
  getUserSavedPetsById,
} = require("../controllers/userCtrlr");

const {
  validateUserInfo,
  validateUserLogin,
  handleValidationErrors,
  checkUser,
  checkAdminStatus,
  validateFieldNumber,
  validateUpdatedUserInfo,
} = require("../controllers/validator");

/* fullName, email, password, phoneNumber */
router.post(
  "/signup",
  validateUserInfo,
  validateFieldNumber(4),
  handleValidationErrors,
  addNewUser
);

/*email, password*/
router.post("/login", validateUserLogin, handleValidationErrors, loginUser);
router.get("/login/token", loginUserWithToken);

router.get("/:id/pets", getUserPetsById);

router.get("/:id/saved", getUserSavedPetsById);

router.get("/:id", getUserById);

// (protected to logged in user)
router.put(
  "/:id",
  checkUser,
  validateUpdatedUserInfo,
  handleValidationErrors,
  updateUserById
);

// (protected to admin)
router.get("/", checkAdminStatus, getUsers);

module.exports = router;
