'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = exports.schema = new Schema({
    body: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: new Date()
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

exports.model = mongoose.model('Comments', commentSchema);