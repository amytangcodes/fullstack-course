'use strict';

const express = require('express');
const app = express();

// 1. Add simple GET request route handler
//
// - IF our express instance gets a request
// - AND that request has a `path` property with matches '/query'
// - AND that request has a `method` property which is 'GET'
// - THEN execute the defined callback

// 2. Echo query string params back in response
// {
//   data: {
//     completed: 'yes'
//   }
// }

// PATH: `/query?hello=world&name=Taylor
//
// req.query:
// {
//   hello: 'world',
//   name: 'Taylor',
// }

// 3. Add GET request route handler with params

 // IMPORTANT:
  // `:{paramName}` tells Express what to call the information
  // in the params object it creates. The values you type above
  // are arbitrary. They can be what ever you want. Do not
  // confuse them with being related to anything else, THEY ARE NOT.
  //

  // PATH: `/params/4444/soemthing/moby-dick`
// {
  //   data: {
  //     identifier: 4444,
  //     bookName: 'moby-dick',
  //   }
  // }

// 4. Add simple GET request route handler
//
  // Simply denotes that the `req` object has a property
  // with the method value for the incoming request
  //

// 5. Add simple GET request route handler
//
  // Simple denotes that the `req` object has a property
  // with the path for this request
  //