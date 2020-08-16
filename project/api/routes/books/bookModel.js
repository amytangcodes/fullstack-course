'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Map to fields in the DB
const bookSchema = exports.schema = new Schema({
  name: String,
  author: String,
  summary: String
})

exports.model = mongoose.model('Book', bookSchema)
