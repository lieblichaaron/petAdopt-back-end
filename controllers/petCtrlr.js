const Pet = require("../models/petModel");
const petInstance = new Pet();
const { isEmpty } = require("../utils/helper");

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
  newPet = JSON.parse(req.body.data);
  newPet.picture = req.file.filename;
  newPet.ownerId = null;

  await petInstance.add(newPet);

  res.json("Pet successfully added");
};

const updatePetById = (req, res) => {
  const { id } = req.params;
  const newPetInfo = req.body;

  const petList = petInstance.updateById(id, newPetInfo);

  res.json(petList);
};

module.exports = {
  getPets,
  getPetById,
  deletePetById,
  addNewPet,
  updatePetById,
};
