// src/config/gridfsBucket.js
const { MongoClient, GridFSBucket } = require('mongodb');
const mongoose = require('mongoose');

const client = new MongoClient(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let gfsBucket;
client.connect().then(() => {
  const db = client.db();
  gfsBucket = new GridFSBucket(db, {
    bucketName: 'uploads'
  });
});


module.exports = gfsBucket;
