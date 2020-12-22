const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const users = require("./users.json");
const pets = require("./pets.json");
const port = 5000;

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

app.use(express.static("pet-images"));

app.post("/signup", (req, res) => {});
app.get("/images", (req, res) => {
  res.json(images);
});

app.post("/photos", upload.single("picture"), (req, res, next) => {
  let newPicObj = {
    image: req.file.filename,
    caption: req.body.caption,
  };
  images.push(newPicObj);
  fs.writeFileSync("./images.json", JSON.stringify(images, null, 2));
  res.redirect("/gallery.html");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
