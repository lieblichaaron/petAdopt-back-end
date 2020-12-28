const { client } = require("../utils/db");
const { ObjectID } = require("mongodb");

// const client = createClient();
const connectToDb = async () => {
  await client.connect();
  const db = client.db("PetAdopt");
  const usersCollection = db.collection("users");
  return usersCollection;
};
module.exports = class User {
  findById = async (id) => {
    try {
      const usersCollection = await connectToDb();
      const user = await usersCollection.findOne({
        _id: ObjectID(id),
      });
      return user;
    } catch (err) {
      return err.stack;
    } finally {
      await client.close();
    }
  };
  deleteById = async (id) => {
    try {
      const usersCollection = await connectToDb();
      await usersCollection.deleteOne({
        _id: ObjectID(id),
      });
      return "User deleted";
    } catch (err) {
      return err.stack;
    } finally {
      await client.close();
    }
  };

  add = async (userData) => {
    try {
      const usersCollection = await connectToDb();
      const newUsersList = await usersCollection.insertOne(userData);
      return newUsersList.insertedId;
    } catch (err) {
      return err.stack;
    } finally {
      await client.close();
    }
  };
  updateById = async (id, newUserInfo) => {
    try {
      const usersCollection = await connectToDb();
      await usersCollection.updateOne(
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
    } finally {
      await client.close();
    }
  };

  findAll = async () => {
    try {
      const usersCollection = await connectToDb();
      const allUsers = await usersCollection.find();
      return allUsers;
    } catch (err) {
      return err.stack;
    } finally {
      await client.close();
    }
  };
};
