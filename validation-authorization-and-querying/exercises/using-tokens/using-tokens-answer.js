'use strict';

// api/routes/users/userRoutes.js
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const app = express();

const { model: UserModel } = require('../models/userModel');
const tokenService = require('../tokenService');

// POST /api/users/
router
  .route('/')
  .post(async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const user = new UserModel({ email, password });
      const doc = await user.save();
      res.status(201).json({
        data: [doc],
      });
    } catch (e) {
      next(e);
    }
  });

// POST /api/users/login/
router
  .route('/login')
  .post(async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const user = await UserModel.findOne({ email });

      if (!user) {
          next(new Error('not found'));
      } else {
        const match = await user.comparePassword(password);

        if (match) {
          const token = tokenService.issueToken(user);
          res.json({
            data: [token],
          });
        } else {
          next(new Error('unauthorized'));
        }
      }
    } catch (e) {
      next(e);
    }
  });

app.use(bodyParser.json());
app.use('/api/users', router);

mongoose.connect('mongodb://localhost:27017/token-example')
  .then(() => {
    console.log('Connected to mongodb.');
    app.listen(6000, () => {
      console.log('Listening on port 6000');
    });
  })
  .catch((err) => {
    console.log(err);
    throw err;
  });