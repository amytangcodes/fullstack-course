'use strict';

const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017';
const dbname = 'test';

MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
  if (err) {
    console.error(err);
    throw err;
  }

  const db = client.db(dbname);
  const collection = db.collection('testExample');

  collection.insert(
    [
      { a:1, b:1 },
      { a:2, b:2 },
      { a:3, b:3 },
      { a:4, b:4 },
    ],
    (err, result) => {
      // console.log(result);

      collection.find({}).toArray((err, items) => {
        console.log('items:', items);
        client.close();
      });
    }
  );
});