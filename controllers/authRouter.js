const authRouter = require('express').Router()

const loginRouter = require('./login');
const registerRouter = require('./register');
const phoneAuthRouter = require('./mobileAuth');

authRouter.use("/login", loginRouter)

authRouter.use("/register", registerRouter)

authRouter.use("/mobile-verify",phoneAuthRouter)

module.exports = authRouter