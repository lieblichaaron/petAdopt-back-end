const bcrypt = require("bcrypt");
const saltRounds = 10;

const encryptPassword = (password) => {
  const hash = bcrypt.hashSync(password, saltRounds);
  return hash;
};

module.exports = { encryptPassword };
