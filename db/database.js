require('dotenv').config();

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
  MongoClient.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_USER_PASSWORD}@cluster0.uwu6dns.mongodb.net/?appName=Cluster0`)
  .then(result => {
    console.log('Connected!');
    callback(result);
  })
  .catch(err => {
    console.error(err);   
  })
}

module.exports = mongoConnect;
