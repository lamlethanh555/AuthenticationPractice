//jshint esversion:6
import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import ejs from 'ejs';
import { mongoose } from 'mongoose';
import encrypt from 'mongoose-encryption';

mongoose.connect('mongodb://127.0.0.1:27017/userDB');

const app = express();

console.log(process.env.API_KEY);

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// When adding encryption, we need the keyword "new" in Schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = mongoose.model('User', userSchema);

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', function (req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password,
    });
    newUser.save();
    res.render('secrets');
});

app.post('/login', function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    async function findUser() {
        const checkUser = await User.findOne({ email: username, password: password });
        if (checkUser) {
            return true;
        } else {
            return false;
        }
    }
    if (findUser()) {
        res.render('secrets');
    }
});

app.listen(3000, function () {
    console.log('listening on port 3000');
});
