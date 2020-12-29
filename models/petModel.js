const { ObjectID } = require("mongodb");
const mongoUtil = require("../utils/db");

module.exports = class Pet {
  constructor() {
    this.petsCollection = mongoUtil.getDb().collection("pets");
  }
  findById = async (id) => {
    try {
      const pet = await this.petsCollection.findOne({
        _id: ObjectID(id),
      });
      return pet;
    } catch (err) {
      return err.stack;
    }
  };

  deleteById = async (id) => {
    try {
      await this.petsCollection.deleteOne({
        _id: ObjectID(id),
      });
      return "Pet deleted";
    } catch (err) {
      return err.stack;
    }
  };

  add = async (petData) => {
    try {
      const newPetsList = await this.petsCollection.insertOne(petData);
      return newPetsList.insertedId;
    } catch (err) {
      return err.stack;
    }
  };

  updateById = async (id, newPetInfo) => {
    try {
      await this.petsCollection.updateOne(
        {
          _id: ObjectID(id),
        },
        {
          $set: {
            type: newPetInfo.type,
            name: newPetInfo.name,
            height: newPetInfo.height,
            adoptionStatus: newPetInfo.adoptionStatus,
            weight: newPetInfo.weight,
            color: newPetInfo.color,
            bio: newPetInfo.bio,
            hypoallergenic: newPetInfo.hypoallergenic,
            dietaryRestrictions: newPetInfo.dietaryRestrictions,
            breedOfAnimal: newPetInfo.breedOfAnimal,
            picture: newPetInfo.picture,
          },
        }
      );
      return "Changes saved";
    } catch (err) {
      return err.stack;
    }
  };

  findByParams = async (params) => {
    try {
      const searchedPetInfo = {};
      if (params.type) searchedPetInfo.type = params.type;
      if (params.name) searchedPetInfo.name = params.name;
      if (params.adoptionStatus)
        searchedPetInfo.adoptionStatus = params.adoptionStatus;
      if (params.height) searchedPetInfo.height = params.height;
      if (params.weight) searchedPetInfo.weight = params.weight;

      const pet = await this.petsCollection.find(searchedPetInfo);
      return pet;
    } catch (err) {
      return err.stack;
    }
  };

  findAll = async () => {
    try {
      const allPets = await this.petsCollection.find();
      return allPets;
    } catch (err) {
      return err.stack;
    }
  };
};
