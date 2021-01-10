const express = require("express");
const router = express.Router();
const multer = require("multer");
const { upload } = require("../utils/cloudinary");

const {
  addNewPet,
  getPetById,
  updatePetById,
  getPets,
  updateAdoptionStatus,
  updateSavedPets,
  addPetImageToCloudinary,
} = require("../controllers/petCtrlr");
const {
  checkAdminStatus,
  checkUser,
  validatePetInfo,
  sanitizePetInfo,
  handleValidationErrors,
  validateFieldNumber,
} = require("../controllers/validator");

const handleImage = (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      res.json("Image file size is too large");
    } else if (err) {
      res.json(err.message);
    } else {
      next();
    }
  });
};
router.post(
  "/",
  handleImage,
  checkAdminStatus,
  sanitizePetInfo,
  validatePetInfo,
  validateFieldNumber(8),
  handleValidationErrors,
  addPetImageToCloudinary,
  addNewPet
);

router.get("/:id", getPetById);

router.put(
  "/:id",
  handleImage,
  checkAdminStatus,
  sanitizePetInfo,
  validatePetInfo,
  handleValidationErrors,
  addPetImageToCloudinary,
  updatePetById
);

router.get("", getPets);

// (protected to logged in users)
router.put("/:id/adopt", checkUser, updateAdoptionStatus);

// (protected to logged in users)
router.put("/:id/save", checkUser, updateSavedPets);

module.exports = router;
