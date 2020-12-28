const MongoClient = require("mongodb").MongoClient;
exports.createClient = () => {
  return new MongoClient(process.env.MDB_URL, { useUnifiedTopology: true });
};
