const fs = require("fs");

const filePath = "./users.json";

module.exports = class Employee {
  constructor() {
    this.db = JSON.parse(fs.readFileSync(filePath, "utf8"));
  }

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

  add = (userData) => {
    this.db.push(userData);
    this.writeToFile(this.db);
    return this.db;
  };

  updateById = (id, newUserInfo) => {
    const newUserList = this.db.map((user) =>
      user.id == id ? { ...user, ...newUserInfo } : user
    );

    this.writeToFile(newUserList);
    return newUserList;
  };

  findByParams = (queryParams = {}) => {
    let found = this.db.filter((employee) =>
      Object.keys(queryParams).every((key) => user[key] == queryParams[key])
    );

    return found;
  };

  findAll = () => {
    return this.db;
  };
};
