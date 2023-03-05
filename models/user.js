const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
	mobileNumber: {
		type: Number,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	language: {
		type: String,
		required: true,
		default: "en"
	},
	gamePlayTime: {
		type: Number,
		default: 100
	},
	username: {
		type: String,
		required: true
	}
})

const User = mongoose.model('User', userSchema)

module.exports = User