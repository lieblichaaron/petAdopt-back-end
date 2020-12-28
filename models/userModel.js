const { createClient } = require("../utils/db");
const client = createClient();
const connectToDb = async () => {
  await client.connect();
  const db = client.db("PetAdopt");
  const usersCollection = db.collection("users");
  return usersCollection;
};
module.exports = class User {
  findById = (id) => {
    return this.db.find((user) => user.id == id);
  };

  writeToFile = (data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  };

  deleteById = (id) => {
    const newUserList = this.db.filter((user) => user.id != id);
    this.writeToFile(newUserList);
    return newUserList;
  };

  add = async (userData) => {
    const usersCollection = await connectToDb();
    const newUsersList = await usersCollection.insertOne(userData);

    client.close();
    return newUsersList.insertedId;
  };

  updateById = (id, newUserInfo) => {
    const newUserList = this.db.map((user) =>
      user.id == id ? { ...user, ...newUserInfo } : user
    );

    this.writeToFile(newUserList);
    return newUserList;
  };

  findByParams = (queryParams = {}) => {
    let found = this.db.filter((user) =>
      Object.keys(queryParams).every((key) => user[key] == queryParams[key])
    );

    return found;
  };

  findAll = () => {
    return this.db;
  };
};
