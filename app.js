const {check, validationResults} = require('express-validator');
const upload = require("express-fileupload");
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const passport = require('passport');
const express = require("express");
const crypto = require('crypto');
const path = require('path');

var app = express();

const PORT = 3000;
//Session constants
const SESSION_NAME = 'sid';
const SESSION_SECRET = 'webDevelopmentForaUniversityCourse';
const MONGO_STORE_SECRET = '20192020project';
const SESSION_LIFETIME = 1000 * 60 * 60 * 1; //One hour timeout

//Database Config
const db = require('./config/db');

//Server Start
app.on('ready', function() { 
    app.listen(PORT, function(){ 
        console.log("The app is listening on port " + PORT);
    }); 
});


//Connect to MongoDB and check for errors
mongoose.connect(db.dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.on('connected', ()=>{
    console.log('Connected to mongo database.');
});
mongoose.connection.on('error', err => {
    console.log('Error at mongoDb: ' + err);
});
mongoose.connection.once('open', function() { 
    // All OK - fire (emit) a ready event. 
    app.emit('ready'); 
});


//Initialize Session
app.use(session({
    name: SESSION_NAME,
    resave: false,
    saveUninitialized: false,
    secret: SESSION_SECRET,
    cookie: {
        maxAge: SESSION_LIFETIME,
        sameSite: true,
        secure: false
    },
    store: new MongoStore({ 
        mongooseConnection: mongoose.connection,
        secret: MONGO_STORE_SECRET,
        autoRemove: 'interval',
        autoRemoveInterval: 60 // In minutes. Default
        // touchAfter: 24 * 3600 // time period in seconds
    })
}));

//Signup Route
let users = require('./routes/users');
//Login Route
let index = require('./routes/index');
//API Route
let api = require('./routes/api');
//API Route
let admin_api = require('./routes/api_admin');

//Routes
app.use('/', index);
app.use('/signup', users);  
app.use('/api', api);
app.use('/admin_api', admin_api);

//Set EJS as view engine
app.set('view engine', 'ejs');

//Setup body parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

//Set static folders
app.use('/css',express.static(path.join(__dirname, 'css')));
app.use('/images',express.static(path.join(__dirname, 'images')));
app.use('/scripts',express.static(path.join(__dirname, 'scripts')));
app.use('/views',express.static(path.join(__dirname, 'views')));

app.use(upload());

//Passport Config
require('./config/passport')(passport);

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Render an error page whenever a user visits an nonexisting link
// app.get("*", function(req, res){
//     res.render('error_page');
// });