const handleRegister = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')

handleRegister.post('/', async (req, res) => {

	const {
		mobileNumber,
		name,
		language,
		gamePlayTime,
		username
	} = req.body

	const existingUser = await User.findOne({
		username
	})
	try {
		if (existingUser) {
			return res.status(400).json({
				error: 'username must be unique'
			})
		} else {
			const user = new User({
				mobileNumber,
				name,
				language,
				gamePlayTime,
				username
			})

			const savedUser = await user.save()

			res.status(201).json(savedUser)
		}
	} catch (e) {
		console.log(e)
	}

})

module.exports = handleRegister