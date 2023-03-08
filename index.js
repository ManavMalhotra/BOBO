const config = require('./utils/config')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express();
const authRouter = require('./controllers/authRouter');

const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken')
const User = require('./models/user')
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');


mongoose
	.connect(config.MONGODB_URI)
	.then(() => {
		console.log('connected to MongoDB')
	})
	.catch((error) => {
		console.error('error connection to MongoDB:', error.message)
	})

app.use(express.static('public'));
app.set('views', './views');
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({
	extended: true
}));

app.use("/api/auth",authRouter)

app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.get('/', async (req, res) => {

	const token = req.cookies.JWT;

	const {
		id
	} = jwt.decode(token)

	console.log(id)
	const user = await User.findById(id)

	if (user) {
		console.log(user.mobileNumber)
		res.render("index.ejs", {
			name: user.name,
			username: user.username
		})
	};

})
app.get('/login', (req, res) => {
	res.render("login")
})

app.get('/register', (req, res) => {
	res.render("register")
})

app.listen(config.PORT, () => {
	console.log(`Server listening on ${config.PORT} `)
})