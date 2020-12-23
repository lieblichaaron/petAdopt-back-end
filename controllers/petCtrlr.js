const Pet = require("../models/petModel");
const { isEmpty } = require("../utils/helper");

const getPets = (req, res) => {
  const queryParams = req.query;

  const petList = isEmpty(queryParams)
    ? Pet.findAll()
    : Pet.findByParams(queryParams);

  res.json(petList);
};

const getPetById = (req, res) => {
  const pet = Pet.findById(req.params.id);
  res.json(pet);
};

const deletePetById = (req, res) => {
  const { id } = req.params;

  const petList = Pet.deleteById(id);

  res.json(petList);
};

const addNewPet = (req, res) => {
  const newPet = req.body;

  const petList = Pet.add(newPet);

  res.json(petList);
};

const updatePetById = (req, res) => {
  const { id } = req.params;
  const newPetInfo = req.body;

  const petList = Pet.updateById(id, newPetInfo);

  res.json(petList);
};

module.exports = {
  getPets,
  getPetById,
  deletePetById,
  addNewPet,
  updatePetById,
};
