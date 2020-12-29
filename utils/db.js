const MongoClient = require("mongodb").MongoClient;
var db;
module.exports = {
  connectToDb: function (callback) {
    MongoClient.connect(
      process.env.MDB_URL,
      { useUnifiedTopology: true, useNewUrlParser: true },
      function (err, client) {
        db = client.db("PetAdopt");
        return callback(err);
      }
    );
  },

  getDb: function () {
    return db;
  },
};
