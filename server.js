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
const salt = bcrypt.genSaltSync(10);

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'Ivan03823443',
      database : 'smartbrain'
    }
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {res.send("It's working!") })
app.post('/signin', signin.handleSignIn(db, bcrypt))
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt, salt)})
app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)})
app.put('/image', (req, res) => {image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)})

app.listen(PORT || 3000, () => {
    console.log(`Server started on port ${PORT}`);
});