'use strict';

const express = require('express');
const app = express();

// 1. Add simple GET request route handler
//
// - IF our express instance gets a request
// - AND that request has a `path` property which matches '/html'
// - AND that request has a `method` property which is 'GET'
// - THEN execute the defined callback

// 2. Send HTML as reponse to incoming request
//
// - `.send()` function will send string data

// 3. Add simple GET request route handler
//
// - IF our express instance gets a request
// - AND that request has a `path` property which matches '/json'
// - AND that request has a `method` property which is 'GET'
// - THEN execute the defined callback

// 4. Send JSON as response to incoming request
//
// - `.json()` function will send JSON data (turns POJO into string JSON)

// 5. Add simple GET request route handler
//
// - IF our express instance gets a request
// - AND that request has a `path` property which matches '/custom'
// - AND that request has a `method` property which is 'GET'
// - THEN execute the defined callback

// 6. Send string response to incoming request
//
// - `.status()` sets the statusCode of the response
// - `.send()` function will send string data