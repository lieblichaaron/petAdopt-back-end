const { ObjectID } = require("mongodb");
const Pet = require("../models/petModel");
const petInstance = new Pet();
const User = require("../models/userModel");
const userInstance = new User();
const { isEmpty } = require("../utils/helper");
const { verifyToken } = require("../utils/auth");

const getPets = async (req, res) => {
  const queryParams = req.query;
  const petList = isEmpty(queryParams)
    ? await petInstance.findAll()
    : await petInstance.findByqueryParams(queryParams);

  res.json(petList);
};

const getPetById = async (req, res) => {
  const pet = await petInstance.findById(req.params.id);
  res.json(pet);
};

const deletePetById = async (req, res) => {
  const { id } = req.params;

  const petList = await petInstance.deleteById(id);

  res.json(petList);
};

const addNewPet = async (req, res) => {
  let newPet = req.body;
  newPet.picture = req.file.filename;
  if (newPet.ownerId) newPet.ownerId = ObjectID(newPet.ownerId);
  newPet.savedBy = [];
  await petInstance.add(newPet);

  res.json("Pet successfully added");
};

const updatePetById = async (req, res) => {
  const { id } = req.params;
  let newPetInfo = req.body;
  if (req.file) newPetInfo.picture = req.file.filename;
  if (newPetInfo.ownerId) newPetInfo.ownerId = ObjectID(newPetInfo.ownerId);

  const updatedPetInfo = await petInstance.updateById(id, newPetInfo);

  res.json(updatedPetInfo);
};
const updateAdoptionStatus = async (req, res) => {
  const { id } = req.params;
  let newAdoptionStatus = req.body;
  const token = req.cookies.jwt;
  const payload = await verifyToken(token);
  newAdoptionStatus.ownerId = ObjectID(payload._id);

  const newPetInfo = await petInstance.updateAdoptionStatusById(
    id,
    newAdoptionStatus
  );

  res.json(newPetInfo);
};
const updateSavedPets = async (req, res) => {
  const petId = req.params.id;
  const token = req.cookies.jwt;
  const payload = await verifyToken(token);
  const userId = payload._id;
  const response = await petInstance.updateSavedBy(petId, userId);

  res.json(response);
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
