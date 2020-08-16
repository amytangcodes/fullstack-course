'use strict';

const mongoose = require('mongoose');
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');

const router = express();

const { router: userRoutes } = require('./routes/users/userRoutes');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use('/api/users', userRoutes);

const server = http.createServer(router);

mongoose
	.connect('mongodb://localhost:27017/hashing', { useNewUrlParser: true })
	.then(async () => {
		console.log(`Connected to database at 'mongodb://localhost:27017/hashing'`);
		server.listen(3000, () => {
			console.log(`Server is running on PORT:3000`);
		});
	}) 
	.catch((err) => {
		console.error(err);
	});