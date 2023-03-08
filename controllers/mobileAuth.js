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

	try{
		console.log(req.body.mobileNumber)
		console.log(req.body.otp)

	if (req.body.mobileNumber && (req.body.otp).length === 6) {

		const mobileNumber = req.body.mobileNumber

		try {
			const user = await User.findOne({
				mobileNumber
			})

			console.log(mobileNumber)
			console.log(user)

			client
				.verify.v2.services(twilioServiceSid)
				.verificationChecks
				.create({
					to: `+${mobileNumber}`,
					code: req.body.otp
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
			message: "Wrong mobile number or OTP code :(",
			mobileNumber: req.body.mobileNumber
		})
	}
}catch(e){
	console.log(e)
}

})


module.exports = mobileAuthRouter