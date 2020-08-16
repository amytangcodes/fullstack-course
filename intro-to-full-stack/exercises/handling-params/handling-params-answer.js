'use strict';

const express = require('express');
const app = express();

// 1. Add simple GET request route handler
//
// - IF our express instance gets a request
// - AND that request has a `path` property with matches '/query'
// - AND that request has a `method` property which is 'GET'
// - THEN execute the defined callback
app.get('/query', (req, res) => {

    const { completed } = req.query;

    console.log(completed);


    // 2. Echo query string params back in response
    // {
    //   data: {
    //     completed: 'yes'
    //   }
    // }
    res.json({ data: req.query });
    // PATH: `/query?hello=world&name=Taylor
    //
    // req.query:
    // {
    //   hello: 'world',
    //   name: 'Taylor',
    // }
});

// 3. Add GET request route handler with params
app.get('/params/:identifier/something/:bookName', (req, res) => {
 // IMPORTANT:
  // `:{paramName}` tells Express what to call the information
  // in the params object it creates. The values you type above
  // are arbitrary. They can be what ever you want. Do not
  // confuse them with being related to anything else, THEY ARE NOT.
  //

  // PATH: `/params/4444/soemthing/moby-dick`
  const { identifier } = req.params;
  
  console.log(identifier);

  res.json({ data: req.params });
  // {
  //   data: {
  //     identifier: 4444,
  //     bookName: 'moby-dick',
  //   }
  // }

});

// 4. Add simple GET request route handler
//
app.get('/method', (req, res) => {
  // Simply denotes that the `req` object has a property
  // with the method value for the incoming request
  //
  res.json({ data: req.path });
});

// 5. Add simple GET request route handler
//
app.get('/path/*', (req, res) => {
  
  // Simple denotes that the `req` object has a property
  // with the path for this request
  //
  res.json({ data: req.path });
});

app.listen(5000, () => {
    console.log('handling-params-answer is listening...');
});

