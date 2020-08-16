'use strict';

const express = require('express');
const app = express();

// app.use('/', express.static('public', options));
app.use('/', express.static('public'));

app.listen(5000, () => {
    console.log('static-express-answer is running...');
});