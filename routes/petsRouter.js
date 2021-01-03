const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  addNewPet,
  getPetById,
  updatePetById,
  getPets,
  updateAdoptionStatus,
  updateSavedPets,
} = require("../controllers/petCtrlr");
const { checkAdminStatus, checkUser } = require("../controllers/validator");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./pet-images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage });

router.post("/", checkAdminStatus, upload.single("picture"), addNewPet);

router.get("/:id", getPetById);

router.put("/:id", checkAdminStatus, upload.single("picture"), updatePetById);

router.get("/", getPets);

// (protected to logged in users)
router.put("/:id/adopt", checkUser, updateAdoptionStatus);

// (protected to logged in users)
router.put("/:id/save", checkUser, updateSavedPets);

module.exports = router;
