const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const mongoUtil = require("./utils/db");

mongoUtil.connectToDb(function (err, client) {
  if (err) console.log(err);
  if (!err) {
    console.log("Connected correctly to db");
    const usersRouter = require("./routes/usersRouter");
    const petsRouter = require("./routes/petsRouter");
    app.use(cors());

    app.use(express.json());
    app.use(express.static("pet-images"));
    app.use(cookieParser());

    app.use("/api/users", usersRouter);

    app.use("/api/pets", petsRouter);

    let port = process.env.PORT;
    if (port == null || port == "") {
      port = 5000;
    }
    app.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}`);
    });
  }
});
