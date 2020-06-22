require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');
const morgan =  require('morgan')
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;
const salt = bcrypt.genSaltSync(10);

const db = knex({
    client: 'pg',
    connection: process.env.POSTGRES_URI
});

const app = express();
app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {res.send("It's working!") })
app.post('/signin', signin.handleSignIn(db, bcrypt))
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt, salt)})
app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)})
app.post('/profile/:id', (req,res) => {profile.handleProfileUpdate(req, res, db)})
app.put('/image', (req, res) => {image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)})

app.listen(PORT || 3000, () => {
    console.log(`Server started on port ${PORT}`);
});