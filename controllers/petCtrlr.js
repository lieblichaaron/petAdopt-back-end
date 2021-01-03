const { ObjectID } = require("mongodb");
const Pet = require("../models/petModel");
const petInstance = new Pet();
const User = require("../models/userModel");
const userInstance = new User();
const { isEmpty } = require("../utils/helper");
const fs = require("fs");

const getPets = (req, res) => {
  const queryParams = req.query;

  const petList = isEmpty(queryParams)
    ? petInstance.findAll()
    : petInstance.findByParams(queryParams);

  res.json(petList);
};

const getPetById = (req, res) => {
  const pet = petInstance.findById(req.params.id);
  res.json(pet);
};

const deletePetById = (req, res) => {
  const { id } = req.params;

  const petList = petInstance.deleteById(id);

  res.json(petList);
};

const addNewPet = async (req, res) => {
  let newPet = JSON.parse(req.body.data);
  newPet.picture = req.file.filename;
  if (newPet.ownerId) {
    const response = await userInstance.findById(newPet.ownerId);
    if (!response) {
      try {
        fs.unlinkSync(req.file.path);
        //file removed
      } catch (err) {
        console.error(err);
      }
      res.json("Owner ID does not match any existing users");
      return;
    } else {
      newPet.ownerId = ObjectID(newPet.ownerId);
    }
  }
  newPet.savedBy = [];
  await petInstance.add(newPet);

  res.json("Pet successfully added");
};

const updatePetById = async (req, res) => {
  const { id } = req.params;
  let newPetInfo = JSON.parse(req.body.data);
  if (req.file) newPetInfo.picture = req.file.filename;

  await petInstance.updateById(id, newPetInfo);

  res.json("Pet successfully updated");
};
const updateAdoptionStatus = async (req, res) => {
  const { id } = req.params;
  let newAdoptionStatus = JSON.parse(req.body);
  const token = req.cookies.jwt;
  const payload = await verifyToken(token);
  newAdoptionStatus.userId = payload.userId;

  await petInstance.updateAdoptionStatusById(id, newAdoptionStatus);

  res.json("success");
};
const updateSavedPets = async (req, res) => {
  const petId = req.params.id;
  const token = req.cookies.jwt;
  const payload = await verifyToken(token);
  const userId = payload.userId;
  const method = req.method;
  await petInstance.updateSavedBy(petId, userId, method);

  res.json("success");
};

module.exports = {
  getPets,
  getPetById,
  deletePetById,
  addNewPet,
  updatePetById,
  updateAdoptionStatus,
  updateSavedPets,
};
