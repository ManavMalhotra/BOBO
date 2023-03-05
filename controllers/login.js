const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const {
	secret,
	twilioSid,
	twilioToken,
	twilioPhoneNumber,
	twilioServiceSid
} = require("../utils/config.js")

const client = require('twilio')(twilioSid, twilioToken)

loginRouter.post('/', async (req, res) => {

	try {
		const {
			mobileNumber
		} = req.body

		const user = await User.findOne({
			mobileNumber
		})

		if (user) {
			const userToken = {
				username: user.username,
				id: user._id
			}

			client.verify
				.services(twilioServiceSid)
				.verifications
				.create({
					to: `+${user.mobileNumber}`,
					channel: 'sms'
				})
				.then(data => {

					res.status(200).send({
						message: "Verification is sent!!",
						username: user.username
					})
				})

		} else {
			return res.status(401).json({
				error: "invalid username or password"
			})
		}
	} catch (e) {
		console.log(e)
	}

})

loginRouter.post('/verify', async (req, res) => {

	if (req.body.mobileNumber && (req.body.code).length === 6) {

		const mobileNumber = req.body.mobileNumber

		try {
			const user = await User.findOne({
				mobileNumber
			})

			client
				.verify.v2
				.services(twilioServiceSid)
				.verificationChecks
				.create({
					to: `+${mobileNumber}`,
					code: req.body.code
				})
				.then(data => {
					if (data.status === "approved") {
						const token = jwt.sign({
							id: user._id,
							verified: true
						}, secret, {
							expiresIn: '1h'
						});

						res.status(200)
							.cookie("JWT", token, {
								httpOnly: true
							})
							.send({
								message: "User is Verified!!",
								token
							})
					}
				})
		} catch (e) {
			console.log("Error At ./controllers/login.js route: /verify", e)
		}
	} else {
		res.status(400).send({
			message: "Wrong phone number or code :(",
			phonenumber: req.query.phonenumber,
			data
		})
	}

})

module.exports = loginRouter