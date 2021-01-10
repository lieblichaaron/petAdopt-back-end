const express = require("express");
const router = express.Router();
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
  sanitizeUserInfo,
} = require("../controllers/validator");

/* fullName, email, password, phoneNumber */
router.post(
  "/signup",
  validateUserInfo,
  sanitizeUserInfo,
  validateFieldNumber(4),
  handleValidationErrors,
  addNewUser
);

/*email, password*/
router.post("/login", validateUserLogin, handleValidationErrors, loginUser);
router.post("/login/token", loginUserWithToken);

router.get("/:id/pets", getUserPetsById);

router.get("/:id/saved", getUserSavedPetsById);

router.get("/:id", getUserById);

// (protected to logged in user)
router.put(
  "/:id",
  checkUser,
  sanitizeUserInfo,
  validateUserInfo,
  handleValidationErrors,
  updateUserById
);

// (protected to admin)
router.post("/", checkAdminStatus, getUsers);

module.exports = router;
