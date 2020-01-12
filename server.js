const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
require('dotenv').config();

const PORT = process.env.PORT;
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PWD = process.env.DB_PWD;
const DB_NAME = process.env.DB_NAME;
const salt = bcrypt.genSaltSync(10);

const db = knex({
    client: 'pg',
    connection: {
      host : DB_HOST,
      user : DB_USER,
      password : DB_PWD,
      database : DB_NAME
    }
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {res.send(database.users) })
app.post('/signin', signin.handleSignIn(db, bcrypt))
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt, salt)})
app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)})
app.put('/image', (req, res) => {image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)})

app.listen(PORT || 3000, () => {
    console.log(`Server started on port ${PORT}`);
});