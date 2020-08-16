const express = require('express');
const router = express.Router();

const { model: UserModel } = require('./userModel');

// POST /api/users/

router
	.route('/')
	.post(async (req, res, next) => {
		console.log(req.body);
		const { email, password } = req.body;
		try {
			const user = new UserModel({ email, password });
			const doc = await user.save();
			res.status(201).json({
				data: [doc]
			});
		} catch (e) {
			next(e);
		}
	})

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
					res.json({
						data: [user]
					});
				} else {
					next(new Error('unauthorized'));
				}
			}
		} catch (e) {
			next(e);
		}
	});

exports.router = router