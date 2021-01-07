const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  addNewPet,
  getPetById,
  updatePetById,
  getPets,
  updateAdoptionStatus,
  updateSavedPets,
} = require("../controllers/petCtrlr");
const {
  checkAdminStatus,
  checkUser,
  validatePetInfo,
  sanitizePetInfo,
  handleValidationErrors,
  validateFieldNumber,
} = require("../controllers/validator");

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
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 150000,
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg file format allowed!"));
    }
  },
}).single("picture");

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
  checkAdminStatus,
  handleImage,
  sanitizePetInfo,
  validatePetInfo,
  validateFieldNumber(11),
  handleValidationErrors,
  addNewPet
);

router.get("/:id", getPetById);

router.put(
  "/:id",
  checkAdminStatus,
  handleImage,
  sanitizePetInfo,
  validatePetInfo,
  handleValidationErrors,
  updatePetById
);

router.get("", getPets);

// (protected to logged in users)
router.put("/:id/adopt", checkUser, updateAdoptionStatus);

// (protected to logged in users)
router.put("/:id/save", checkUser, updateSavedPets);

module.exports = router;
