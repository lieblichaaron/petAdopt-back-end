const User = require("../models/userModel");
const userInstance = new User();
const Pet = require("../models/petModel");
const petInstance = new Pet();
const { createToken, verifyToken } = require("../utils/auth");
const { encryptPassword } = require("../utils/passwordEncrypt");
const maxAge = 3 * 24 * 60 * 60 * 1000;

const getUserPetsById = async (req, res) => {
  const { id } = req.params;
  const pets = await petInstance.findPetsByUserId(id);
  res.json(JSON.stringify(pets));
};

const getUsers = async (req, res) => {
  const userList = await userInstance.findAll();
  res.json(JSON.stringify(userList));
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  const user = await userInstance.findById(id);
  res.json(JSON.stringify(user));
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
  res.cookie("jwt", token, { maxAge });
  res.send(JSON.stringify(user));
};

const loginUser = async (req, res) => {
  const user = await userInstance.findByField("email", req.body.email);
  const token = createToken(user);
  res.cookie("jwt", token, { maxAge });
  res.send(JSON.stringify(user));
};

const loginUserWithToken = async (req, res) => {
  const token = req.cookies.jwt;
  const payload = await verifyToken(token);
  if (!payload) {
    res.status(401).send("false");
  } else {
    const user = await userInstance.findById(payload._id);
    if (user) {
      const newToken = createToken(user);
      res.cookie("jwt", newToken, { maxAge });
      res.send(JSON.stringify(user));
    } else {
      res.send("false");
    }
  }
};

const updateUserById = async (req, res) => {
  const { id } = req.params;
  const newUserInfo = req.body;
  if (!("adminStatus" in newUserInfo)) {
    await userInstance.updateById(id, newUserInfo);
    res.send("Update successful");
  }
};

module.exports = {
  getUsers,
  getUserById,
  addNewUser,
  updateUserById,
  loginUser,
  loginUserWithToken,
  getUserPetsById,
};
