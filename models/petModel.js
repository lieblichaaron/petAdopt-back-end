const { createClient } = require("../utils/db");
const client = createClient();
module.exports = class Pet {
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

  add = async (petData) => {
    await client.connect();
    const db = client.db("PetAdopt");
    const petsCollection = db.collection("pets");
    const newPetList = await petsCollection.insertOne(petData);
    console.log(newPetList);
    client.close();
    return newPetList;
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
