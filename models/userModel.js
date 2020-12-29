const { ObjectID } = require("mongodb");
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
      return err.stack;
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
      const newUser = await this.usersCollection.insertOne(userData);
      return newUser.insertedId;
    } catch (err) {
      return err.stack;
    }
  };
  updateById = async (id, newUserInfo) => {
    try {
      await this.usersCollection.updateOne(
        {
          _id: ObjectID(id),
        },
        {
          $set: {
            fullName: newUserInfo.fullName,
            email: newUserInfo.email,
            password: newUserInfo.password,
            phoneNumber: newUserInfo.phoneNumber,
            bio: newUserInfo.bio,
          },
        }
      );
      return "Changes saved";
    } catch (err) {
      return err.stack;
    }
  };

  findAll = async () => {
    try {
      const allUsers = await this.usersCollection.find();
      return allUsers;
    } catch (err) {
      return err.stack;
    }
  };
};
