const { ObjectID } = require("mongodb");
const Pet = require("../models/petModel");
const petInstance = new Pet();
const { isEmpty } = require("../utils/helper");
const { verifyToken } = require("../utils/auth");
const { parser, cloudinary } = require("../utils/cloudinary");
const path = require("path");

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
  if (newPet.ownerId) newPet.ownerId = ObjectID(newPet.ownerId);
  newPet.savedBy = [];
  await petInstance.add(newPet);

  res.json("Pet successfully added");
};

const addPetImageToCloudinary = (req, res, next) => {
  if (req.file) {
    parser.format(
      path.extname(req.file.originalname).toString(),
      req.file.buffer
    );

    cloudinary.uploader.upload(parser.content, (error, result) => {
      if (error) {
        console.log(error);
      } else {
        req.body.picture = result.secure_url;
      }
      next();
    });
  } else {
    next();
  }
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
  let newAdoptionStatus = {};
  newAdoptionStatus.adoptionStatus = req.body.adoptionStatus;
  const token = req.body.token;
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
  const token = req.body.token;
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
  addPetImageToCloudinary,
};
