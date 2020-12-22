const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const users = require("./users.json");
const pets = require("./pets.json");
const port = 5000;

let petsObj = {};
pets.forEach((pet) => {
  petsObj[pet.id] = pet;
});
let usersObj = {};
users.forEach((user) => {
  usersObj[user.id] = user;
});

const storage = multer.diskStorage({
  destination: "./pet-images",
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage });

const app = express();
app.use(express.json());
app.use(express.static("pet-images"));

app.post("/signup", (req, res) => {
  //     The signup api is responsible for signing up a new user.
  // Validate all the user input is valid
  // Check that passwords match
  // Make sure the email address is unique
  // Store the user in your DB and log the user in
  // Be sure not to save the users password as a plain string. (bcrypt is a great tool for this)
  // Fields:
  // Email Address
  // Password (twice to make sure passwords match)
  // First and last name
  // Phone number
});
app.post("/login", (req, res) => {
  //     The login api is responsible for logging in existing users
  // Validate all the user input is valid
  // Check the email and password match an existing user
  // Retrieve the users data from the database and login the user.
  // Fields:
  // Email address
  // Password
});

// (Protected to admin only)
app.post("/pet", (req, res) => {
  //     The add pet api is responsible for adding new pets
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
app.get("/pet/:id", (req, res) => {
  const { id } = req.params;
  res.json(petsObj[id]);
});

//   (protected to admin only)
app.put("/pet/:id", (req, res) => {
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
app.get("/pet", (req, res) => {
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
app.post("/pet/:id/adopt", (req, res) => {
  // The Adopt/Foster API is responsible for adding the pet to the current users pets.
  // This API also should change the pet’s adoption status.
  // Field:
  // Type (Adopt or foster)
});

// (protected to logged in users)
app.post("/pet/:id/return", (req, res) => {
  //     The Return Pet API is responsible for returning the pet to the agency.
  //     The API should change the pets status back to available
  //     The API should remove the pet from the users pets.
});
app.post("/pet/:id/save", (req, res) => {
  //     The save PET api allows a user to save a pet for later
  // The saved pet should be stored as saved in the users account
});

// (protected to logged in users)
app.delete("/pet/:id/save", (req, res) => {
  // The save PET api allows a user to remove a saved pet.
});
app.get("/pet/user/:id", (req, res) => {
  const { id } = req.params;
  res.json(usersObj[id].pets);
});
app.get("/user/:id", (req, res) => {
  const { id } = req.params;
  res.json(usersObj[id]);
});

// (protected to logged in user)
app.put("/user/:id", (req, res) => {
  //     This API allows you to change your settings while logged in.
  // Validate user inputs
  // Ensure that if the email is being changed it’s not already in use
  // Fields:
  // Password
  // Email
  // first name
  // last name
  // phone number
  // bio
});

// (protected to admin)
app.get("/user", (req, res) => {
  //     The GET users API returns all users in the DB.
  // The API should only return the information required

  res.json(users);
});

app.get("/user/:id/full", (req, res) => {
  //     This api allows you to get a user based on the user's id.
  // The API should return all the user details (aside from password) and the users pets they own.
});
// app.post("/signup", (req, res) => {});
// app.post("/photos", upload.single("picture"), (req, res, next) => {
//   let newPicObj = {
//     image: req.file.filename,
//     caption: req.body.caption,
//   };
//   images.push(newPicObj);
//   fs.writeFileSync("./images.json", JSON.stringify(images, null, 2));
//   res.redirect("/gallery.html");
// });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
