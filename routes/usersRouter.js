const express = require("express");
const router = express.Router();
const fs = require("fs");
const {
  getUsers,
  getUserById,
  deleteUserById,
  addNewUser,
  updateUserById,
  loginUser,
  loginUserWithToken,
} = require("../controllers/userCtrlr");

const {
  validateUserSignup,
  validateUserLogin,
  handleValidationErrors,
} = require("../controllers/validator");

/* fullName, email, password, phoneNumber */
router.post("/signup", validateUserSignup, handleValidationErrors, addNewUser);

/*email, password*/
router.post("/login", validateUserLogin, handleValidationErrors, loginUser);
router.get("/login/token", loginUserWithToken);

router.get("/:id/pets", (req, res) => {
  const { id } = req.params;
  res.json(usersObj[id].pets);
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  res.json(usersObj[id]);
});

// (protected to logged in user)
router.put("/:id", (req, res) => {
  //     This API allows you to change your settings while logged in.
  // Validate user inputs
  // Ensure that if the email is being changed it’s not already in use
  // Fields:
  // Password
  // Email
  // first name
  // last name
  // phone number
  // bio
});

// (protected to admin)
router.get("/", (req, res) => {
  //     The GET users API returns all users in the DB.
  // The API should only return the information required

  res.json(users);
});

router.get("/:id/full", (req, res) => {
  //     This api allows you to get a user based on the user's id.
  // The API should return all the user details (aside from password) and the users pets they own.
});

module.exports = router;
