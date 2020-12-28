const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { addNewPet, getPetById } = require("../controllers/petCtrlr");
const { checkAdminStatus } = require("../controllers/validator");

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

// (Protected to admin only)
router.post("/pet", checkAdminStatus, upload.single("picture"), addNewPet);

router.get("/pet/:id", getPetById);

//   (protected to admin only)
router.put("/:id", checkAdminStatus, (req, res) => {
  // The add pet api is responsible for editing pets
  // Validate all the user input is valid
  // Handle photo upload
  // Store pet information in the database
  // Fields:
  // Type
  // Name
  // Adoption Status (Adopted, Fostered, Available)
  // Picture (Picture location URL/Path)
  // Height (number)
  // Weight (Number)
  // Color
  // Bio
  // Hypoallergenic (Boolean)
  // Dietary restrictions
  // Breed
});

router.get("/", (req, res) => {
  if (req.url === "/pet") {
    res.json(pets);
  } else {
    const type = req.query.type;
    const height = req.query.height;
    const weight = req.query.weight;
    const name = req.query.name;
    const adoptionStatus = req.query.adoptionStatus;
    let petsSearchResults = pets.filter((pet) => {
      return (
        (pet.type === type || type === "Species") &&
        (pet.adoptionStatus === adoptionStatus ||
          adoptionStatus === "Adoption status") &&
        ((pet.height >= parseInt(height.split("-")[0]) &&
          pet.height <= parseInt(height.split("-")[1])) ||
          height === "Height(cm)") &&
        ((pet.weight >= parseInt(weight.split("-")[0]) &&
          pet.weight <= parseInt(weight.split("-")[1])) ||
          weight === "Weight(kg)") &&
        (pet.name === name || !name)
      );
    });
    res.json(petsSearchResults);
  }
});

// (protected to logged in users)
router.post("/:id/adopt", (req, res) => {
  // The Adopt/Foster API is responsible for adding the pet to the current users pets.
  // This API also should change the pet’s adoption status.
  // Field:
  // Type (Adopt or foster)
});

// (protected to logged in users)
router.post("/:id/return", (req, res) => {
  //     The Return Pet API is responsible for returning the pet to the agency.
  //     The API should change the pets status back to available
  //     The API should remove the pet from the users pets.
});

router.post("/:id/save", (req, res) => {
  //     The save PET api allows a user to save a pet for later
  // The saved pet should be stored as saved in the users account
});

// (protected to logged in users)
router.delete("/:id/save", (req, res) => {
  // The save PET api allows a user to remove a saved pet.
});
module.exports = router;
