const bcrypt = require("bcrypt");
const saltRounds = 10;

const encryptPassword = (password) => {
  const hash = bcrypt.hashSync(password, saltRounds);
  return hash;
};
const checkPassword = (password, hash) => {
  const bool = bcrypt.compareSync(password, hash);
  return bool;
};

module.exports = { encryptPassword, checkPassword };
