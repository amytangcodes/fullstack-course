'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const { schema: commentSchema } = require('./commentModel');

const postSchema = exports.schema = new Schema({
    title: String,
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
    },
    comments: [commentSchema]
});

exports.model = mongoose.model('Posts', postSchema);