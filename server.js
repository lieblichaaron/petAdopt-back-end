const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const port = 5000;

const usersRouter = require("./routes/usersRouter");
const petsRouter = require("./routes/petsRouter");

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.static("pet-images"));
app.use(cookieParser());

app.use("/users", usersRouter);

app.use("/pets", petsRouter);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
