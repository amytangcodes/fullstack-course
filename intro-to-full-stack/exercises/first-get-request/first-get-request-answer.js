'use strict';

// 1. Require express package
const express = require('express');

// 2. Instantiate express "app"
const app = express();

// 3. Add simple GET request route handler
//
// - IF our express instance gets a request
// - AND that request has a `path` property which matches '/'
// - AND that request has a `method` property which is 'GET'
// - THEN execute the defined callback
app.get('/', (request, response) => {
    // 4. Send 'hello world' as the response to the incoming request
    response.send('hello world');
});

// 5. Start the application
app.listen(5000, () => {
    console.log('first-get-request-answer is running...');
});