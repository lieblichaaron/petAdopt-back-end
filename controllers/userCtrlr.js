const User = require("../models/userModel");
const userInstance = new User();
const { isEmpty } = require("../utils/helper");
const { createToken, verifyToken } = require("../utils/auth");
const { encryptPassword } = require("../utils/passwordEncrypt");
const maxAge = 3 * 24 * 60 * 60 * 1000;

const getUsers = (req, res) => {
  const queryParams = req.query;

  const userList = isEmpty(queryParams)
    ? userInstance.findAll()
    : userInstance.findByParams(queryParams);

  res.json(userList);
};

const getUserById = (req, res) => {
  const user = userInstance.findById(req.params.id);
  res.json(user);
};

const deleteUserById = (req, res) => {
  const { id } = req.params;

  const userList = userInstance.deleteById(id);

  res.json(userList);
};

const addNewUser = async (req, res) => {
  const newUser = {
    ...req.body,
    password: encryptPassword(req.body.password),
    bio: "",
    savedPets: [],
    pets: [],
  };
  const userId = await userInstance.add(newUser);
  const token = createToken(userId);
  res.cookie("jwt", token, { maxAge });
  res.send(JSON.stringify(userId));
};

const loginUser = (req, res) => {
  const token = createToken(req.body.email);
  /*make sure the cookie cant time out when user is online*/
  res.cookie("jwt", token, { maxAge });
  /*send id of req.body.email*/
  res.send(JSON.stringify(req.body.email));
};
const loginUserWithToken = async (req, res) => {
  const token = req.cookies.jwt;
  const payload = await verifyToken(token);
  const id = JSON.stringify(payload.userId);
  const newToken = createToken(payload.userId);
  res.cookie("jwt", newToken, { maxAge });
  res.send(id);
};
const updateUserById = (req, res) => {
  const { id } = req.params;
  const newUserInfo = req.body;

  const userList = userInstance.updateById(id, newUserInfo);

  res.json(userList);
};

module.exports = {
  getUsers,
  getUserById,
  deleteUserById,
  addNewUser,
  updateUserById,
  loginUser,
  loginUserWithToken,
};
