'use strict'

const express = require('express')
const router = express.Router()

const bookService = require('./bookService')

// GET /books/
router.route('/')
  .get(async (req, res, next) => {
    try {
      // 1. Fetch all books from database
      const books = await bookService.listBooks()
      // 2. Respond with list of books
      res.status(200).send({
        data: books
      })
    } catch (e) {
      // 3. If error, send to the error handler
      next(e)
    }
  })

// POST /books/
router.route('/')
  .post(async (req, res, next) => {
    // 1. Get data from request body
    // Format of the request for this destructuring would look like:
    /*
      {
        "bookData": {
          "name": "Moby Dick",
          "author": "Herman Melville",
          "summary": "Really good book. It's about a lot of stuff"
        }
      }
    */
    // Play around with the destructuring if you would like the request to be sent in a different way
    const { bookData } = req.body
    try {
      // 2. Create book from data
      const book = await bookService.createBook(bookData)
      // 3. Respond with created book
      res.status(200).send({
        data: [book]
      })
    } catch (e) {
      // 4. If error, send to the error handler
      next(e)
    }
  })

exports.router = router
