const { client } = require("../utils/db");
const { ObjectID } = require("mongodb");

// const client = createClient();
const connectToDb = async () => {
  await client.connect();
  const db = client.db("PetAdopt");
  const usersCollection = db.collection("pets");
  return usersCollection;
};
module.exports = class Pet {
  findById = async (id) => {
    try {
      const petsCollection = await connectToDb();
      const pet = await petsCollection.findOne({
        _id: ObjectID(id),
      });
      return pet;
    } catch (err) {
      return err.stack;
    } finally {
      await client.close();
    }
  };

  deleteById = async (id) => {
    try {
      const petsCollection = await connectToDb();
      await petsCollection.deleteOne({
        _id: ObjectID(id),
      });
      return "Pet deleted";
    } catch (err) {
      return err.stack;
    } finally {
      await client.close();
    }
  };

  add = async (petData) => {
    try {
      const petsCollection = await connectToDb();
      const newPetsList = await petsCollection.insertOne(petData);
      return newPetsList.insertedId;
    } catch (err) {
      return err.stack;
    } finally {
      await client.close();
    }
  };

  updateById = async (id, newPetInfo) => {
    try {
      const petsCollection = await connectToDb();
      await petsCollection.updateOne(
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
    } finally {
      await client.close();
    }
  };

  findByParams = async (params) => {
    try {
      const petsCollection = await connectToDb();
      const searchedPetInfo = {};
      if (params.type) searchedPetInfo.type = params.type;
      if (params.name) searchedPetInfo.name = params.name;
      if (params.adoptionStatus)
        searchedPetInfo.adoptionStatus = params.adoptionStatus;
      if (params.height) searchedPetInfo.height = params.height;
      if (params.weight) searchedPetInfo.weight = params.weight;

      const pet = await petsCollection.find(searchedPetInfo);
      return pet;
    } catch (err) {
      return err.stack;
    } finally {
      await client.close();
    }
  };

  findAll = async () => {
    try {
      const petsCollection = await connectToDb();
      const allPets = await petsCollection.find();
      return allPets;
    } catch (err) {
      return err.stack;
    } finally {
      await client.close();
    }
  };
};
