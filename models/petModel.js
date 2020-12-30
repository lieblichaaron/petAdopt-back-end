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
  updateAdoptionStatusById = async (id, newAdoptionStatus) => {
    try {
      if (newAdoptionStatus.adoptionStatus === "Looking for a new home") {
        newAdoptionStatus.userId = null;
      }
      await this.petsCollection.updateOne(
        {
          _id: ObjectID(id),
        },
        {
          $set: {
            adoptionStatus: newAdoptionStatus.adoptionStatus,
            ownerId: newAdoptionStatus.userId,
          },
        }
      );
      return "Changes saved";
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
  updateSavedBy = async (petId, userId, method) => {
    try {
      let operation;
      if (method === "PUT") {
        operation = { $push: { savedBy: userId } };
      } else if (method === "DELETE") {
        operation = { $pull: { savedBy: userId } };
      }

      await this.petsCollection.updateOne(
        {
          _id: ObjectID(petId),
        },
        operation
      );
      return "Changes saved";
    } catch (err) {
      return err.stack;
    }
  };
  findByqueryParams = async (queryParams) => {
    try {
      const searchedPetInfo = {};
      if (queryParams.type) searchedPetInfo.type = queryParams.type;
      if (queryParams.name) searchedPetInfo.name = queryParams.name;
      if (queryParams.adoptionStatus)
        searchedPetInfo.adoptionStatus = queryParams.adoptionStatus;
      if (queryParams.height) searchedPetInfo.height = queryParams.height;
      if (queryParams.weight) searchedPetInfo.weight = queryParams.weight;

      const pets = await this.petsCollection.find(searchedPetInfo);
      return pets;
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
