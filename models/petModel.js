const fs = require("fs");

const filePath = "./pets.json";

module.exports = class Pet {
  constructor() {
    this.db = JSON.parse(fs.readFileSync(filePath, "utf8"));
  }

  findById = (id) => {
    return this.db.find((pet) => pet.id == id);
  };

  writeToFile = (data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  };

  deleteById = (id) => {
    const newPetList = this.db.filter((pet) => pet.id != id);
    this.writeToFile(newPetList);
    return newPetList;
  };

  add = (petData) => {
    this.db.push(petData);
    this.writeToFile(this.db);
    return this.db;
  };

  updateById = (id, newPetInfo) => {
    const newPetList = this.db.map((pet) =>
      pet.id == id ? { ...pet, ...newPetInfo } : pet
    );

    this.writeToFile(newPetList);
    return newPetList;
  };

  findByParams = (queryParams = {}) => {
    let found = this.db.filter((pet) =>
      Object.keys(queryParams).every((key) => pet[key] == queryParams[key])
    );

    return found;
  };

  findAll = () => {
    return this.db;
  };
};
