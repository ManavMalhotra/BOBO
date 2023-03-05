require('dotenv').config()
const PORT = process.env.PORT
const twilioSid = process.env.TWILIO_ACCOUNT_SID
const twilioToken = process.env.TWILIO_AUTH_TOKEN
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER
const twilioServiceSid = process.env.TWILIO_SERVICE_SID

const secret = process.env.SECRET
const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

module.exports = {
  MONGODB_URI,
  PORT,
  secret,
  twilioSid,
  twilioServiceSid,
  twilioToken,
  twilioPhoneNumber
}