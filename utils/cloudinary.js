const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});
const DatauriParser = require("datauri/parser");
const parser = new DatauriParser();
const multer = require("multer");
const storage = multer.memoryStorage();
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

module.exports = {
  cloudinary,
  parser,
  upload,
};
