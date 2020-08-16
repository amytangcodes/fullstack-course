'use strict';

// 1. Require express package

// 2. Instantiate router instance

// 3. Define a route in the router
//
// - Will handle all requests with path '/'

// 4. Utilse body-parser middleware in express instance
//
// - Will attempt to parse every request
// - IF request has a body
// - AND body is JSON
// - THEN create `.body` property on `req` object [req.body]
// -      JSON.parse() the body of the request
// -      set `req.body` equal to JSON.parse() value

// 5. Assign `router` to handle all requests with a path beginning with '/router'