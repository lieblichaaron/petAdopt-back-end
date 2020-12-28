const MongoClient = require("mongodb").MongoClient;
module.exports = new MongoClient(process.env.MDB_URL, {
  useUnifiedTopology: true,
});
// exports.createClient = () => {
//   return new MongoClient(process.env.MDB_URL, { useUnifiedTopology: true });
// };
