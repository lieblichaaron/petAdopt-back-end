const User = require("../models/userModel");
const userInstance = new User();
const Pet = require("../models/petModel");
const petInstance = new Pet();
const { createToken, verifyToken } = require("../utils/auth");
const { encryptPassword } = require("../utils/passwordEncrypt");

const getUserPetsById = async (req, res) => {
  const { id } = req.params;
  if (id.slice(0, 5) === "token") {
    const token = id.slice(5);
    const payload = await verifyToken(token);
    const pets = await petInstance.findPetsByUserId(payload._id);
    res.json(pets);
  } else {
    const pets = await petInstance.findPetsByUserId(id);
    res.json(pets);
  }
};
const getUserSavedPetsById = async (req, res) => {
  const { id } = req.params;
  if (id.slice(0, 5) === "token") {
    const token = id.slice(5);
    const payload = await verifyToken(token);
    const pets = await petInstance.findPetsSavedByUserId(payload._id);
    res.json(pets);
  } else {
    const pets = await petInstance.findPetsSavedByUserId(id);
    res.json(pets);
  }
};
const getUsers = async (req, res) => {
  const userList = await userInstance.findAll();
  res.json(userList);
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  const user = await userInstance.findById(id);
  res.json(user);
};

const addNewUser = async (req, res) => {
  const newUserInfo = {
    ...req.body,
    password: encryptPassword(req.body.password),
    bio: "",
    adminStatus: false,
  };
  const user = await userInstance.add(newUserInfo);
  const token = createToken(user);
  res.json({ user, token });
};

const loginUser = async (req, res) => {
  const user = await userInstance.findByField("email", req.body.email);
  const token = createToken(user);
  res.json({ user, token });
};

const loginUserWithToken = async (req, res) => {
  const token = req.body.token;
  const payload = await verifyToken(token);
  if (!payload) {
    res.status(401).send("false");
  } else {
    const user = await userInstance.findById(payload._id);
    if (user) {
      const newToken = createToken(user);
      res.json({ user, newToken });
    } else {
      res.send("false");
    }
  }
};

const updateUserById = async (req, res) => {
  const { id } = req.params;
  const token = req.body.token;
  const payload = await verifyToken(token);
  if (payload._id !== id) {
    res.status(403).send("Cannot change other users information");
    return;
  }
  delete req.body.token;
  const updatedUserInfo = await userInstance.updateById(id, req.body);
  res.json(updatedUserInfo);
};

module.exports = {
  getUserSavedPetsById,
  getUsers,
  getUserById,
  addNewUser,
  updateUserById,
  loginUser,
  loginUserWithToken,
  getUserPetsById,
};
