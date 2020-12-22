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
app.get("/pet/:id", (req, res) => {
  const { id } = req.params;
  res.json(petsObj[id]);
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
