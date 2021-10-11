const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://ahgarawani:10ToThe-6898@cluster0.flaxh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
  )
    .then((client) => {
      console.log("Connected!");
      callbacl(client);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = mongoConnect;
