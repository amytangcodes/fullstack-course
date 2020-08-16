'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = exports.schema = new Schema({
    firstName: String,
    lastName: String
});

exports.model = mongoose.model('Users', userSchema);