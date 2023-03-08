const mobileAuthRouter = require('express').Router()

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


mobileAuthRouter.post('/', async (req, res) => {

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
			console.log(e)
		}
	} else {
		res.status(400).send({
			message: "Wrong phone number or code :(",
			phonenumber: req.body.mobileNumber,
			data
		})
	}

})


module.exports = mobileAuthRouter