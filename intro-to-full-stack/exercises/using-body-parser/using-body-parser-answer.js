'use strict';

// 1. Require express package
const express = require('express');
const bodyParser = require('body-parser');

// 2. Instantiate router instance
const router = express.Router();

const app = express();

// 3. Define a route in the router
//
// - Will handle all requests with path '/'
router.route('/')
    
    // Define route handler for 'GET' method
    .get((req, res) => {
        res.json({
            data: {
                path: req.path,
                method: req.method
            }
        });
    })

    // Define route handler for 'POST' method
    .post((req, res) => {
        //
        // We only have `req.body` because we're using
        // the `body-parser` package with our express
        // instance. [app.use(bodyParser.json())]
        // 
        res.json({
            path: req.path,
            method: req.method,
            payload: req.body,
            message: req.body.hello
        });
    });

// 4. Utilse body-parser middleware in express instance
//
// - Will attempt to parse every request
// - IF request has a body
// - AND body is JSON
// - THEN create `.body` property on `req` object [req.body]
// -      JSON.parse() the body of the request
// -      set `req.body` equal to JSON.parse() value
app.use(bodyParser.json());

// 5. Assign `router` to handle all requests with a path beginning with '/router'
app.use('/router', router);

app.listen(5000, () => {
    console.log('using-body-parser-answer is running...');
});