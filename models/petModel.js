const { ObjectID } = require("mongodb");
const mongoUtil = require("../utils/db");

module.exports = class Pet {
  constructor() {
    this.petsCollection = mongoUtil.getDb().collection("pets");
  }
  findPetsByUserId = async (id) => {
    try {
      const petsCursor = await this.petsCollection.find({
        ownerId: ObjectID(id),
      });
      const pets = petsCursor.toArray();
      return pets;
    } catch (err) {
      return err.stack;
    }
  };
  findPetsSavedByUserId = async (id) => {
    try {
      const petsCursor = await this.petsCollection.find({
        savedBy: { $in: [id] },
      });
      const pets = petsCursor.toArray();
      return pets;
    } catch (err) {
      return err.stack;
    }
  };
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
  findByqueryParams = async (queryParams) => {
    try {
      if ("height" in queryParams && queryParams.height.length === 3) {
        queryParams.height = {
          $gte: parseInt(queryParams.height.split("+")[0]),
        };
      } else if ("height" in queryParams) {
        queryParams.height = {
          $gte: parseInt(queryParams.height.split("-")[0]),
          $lte: parseInt(queryParams.height.split("-")[1]),
        };
      }
      if ("weight" in queryParams && queryParams.weight.length === 3) {
        queryParams.weight = {
          $gte: parseInt(queryParams.weight.split("+")[0]),
        };
      } else if ("weight" in queryParams) {
        queryParams.weight = {
          $gte: parseInt(queryParams.weight.split("-")[0]),
          $lte: parseInt(queryParams.weight.split("-")[1]),
        };
      }
      const petsCursor = await this.petsCollection.find(queryParams);
      const pets = await petsCursor.toArray();
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
      if (petData.adoptionStatus === "Available") {
        petData.ownerId = null;
      }
      const newPet = await this.petsCollection.insertOne(petData);
      return newPet.insertedId;
    } catch (err) {
      return err.stack;
    }
  };
  updateAdoptionStatusById = async (id, newAdoptionStatus) => {
    try {
      if (newAdoptionStatus.adoptionStatus === "Available") {
        newAdoptionStatus.ownerId = null;
      }
      await this.petsCollection.updateOne(
        {
          _id: ObjectID(id),
        },
        {
          $set: newAdoptionStatus,
        }
      );
      const pet = await this.findById(id);
      return pet;
    } catch (err) {
      return err.stack;
    }
  };
  updateById = async (id, newPetInfo) => {
    try {
      if (newPetInfo.adoptionStatus === "Available") {
        newPetInfo.ownerId = null;
      }
      await this.petsCollection.updateOne(
        {
          _id: ObjectID(id),
        },
        {
          $set: newPetInfo,
        }
      );
      const pet = await this.findById(id);
      return pet;
    } catch (err) {
      return false;
    }
  };
  updateSavedBy = async (petId, userId) => {
    try {
      const pet = await this.findById(petId);
      let operation;
      if (!pet.savedBy.includes(userId)) {
        operation = { $push: { savedBy: userId } };
      } else {
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
};
