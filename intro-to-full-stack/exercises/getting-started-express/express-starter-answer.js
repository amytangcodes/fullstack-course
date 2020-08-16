'use strict';

// 1. Require express package
const express = require('express');

// 2. Instantiate express "app"
const app = express();

// 3. Start application
app.listen(5000, () => {
    console.log('express-starter-answer is running...');
});