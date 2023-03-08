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
				error: "Invalid Mobile Number"
			})
		}
	} catch (e) {
		console.log(e)
	}

})

module.exports = loginRouter