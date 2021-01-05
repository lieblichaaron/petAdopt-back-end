const { ObjectID } = require("mongodb");
const { encryptPassword } = require("../utils/passwordEncrypt");
const mongoUtil = require("../utils/db");

module.exports = class User {
  constructor() {
    this.usersCollection = mongoUtil.getDb().collection("users");
  }
  findByField = async (field, value) => {
    try {
      const user = await this.usersCollection.findOne({
        [field]: value,
      });
      return user;
    } catch (err) {
      return false;
    }
  };
  findById = async (id) => {
    try {
      const user = await this.usersCollection.findOne({
        _id: ObjectID(id),
      });
      return user;
    } catch (err) {
      return false;
    }
  };
  deleteById = async (id) => {
    try {
      await this.usersCollection.deleteOne({
        _id: ObjectID(id),
      });
      return "User deleted";
    } catch (err) {
      return err.stack;
    }
  };

  add = async (userData) => {
    try {
      const newUserCursor = await this.usersCollection.insertOne(userData);
      const newUser = newUserCursor.ops[0];
      return newUser;
    } catch (err) {
      return err.stack;
    }
  };
  updateById = async (id, newUserInfo) => {
    try {
      if ("password" in newUserInfo) {
        newUserInfo.password = encryptPassword(newUserInfo.password);
      }
      await this.usersCollection.updateOne(
        {
          _id: ObjectID(id),
        },
        {
          $set: newUserInfo,
        }
      );
      const user = await this.findById(id);
      return user;
    } catch (err) {
      return err.stack;
    }
  };

  findAll = async () => {
    try {
      const usersCursor = await this.usersCollection.find();
      const allUsers = await usersCursor.toArray();
      return allUsers;
    } catch (err) {
      return err.stack;
    }
  };
};
