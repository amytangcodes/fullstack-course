'use strict';

const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017';
const dbname = 'hackeryou';

MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
  if (err) {
    console.error(err);
    throw err;
  }

  console.log(`Connected to server: ${url}`);

  const db = client.db(dbname); // use {database-name}
  const collection = db.collection('movies');

  collection.find({}).toArray((err, items) => {

    console.log(items);

    client.close();
  });
});