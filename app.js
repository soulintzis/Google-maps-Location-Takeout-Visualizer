const {check, validationResults} = require('express-validator');
const upload = require("express-fileupload");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const passport = require('passport');
const express = require("express");
const path = require('path');

var app = express();

const PORT = 80;

//Database Config
const db = require('./config/db');

//Server Start
app.listen(PORT, () => {
    console.log("The app is listening on port " +PORT);
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

//Signup Route
var users = require('./routes/users');
//Login Route
var index = require('./routes/index');

//Routes
app.use('/', index);
app.use('/signup', users);  

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

app.get("/home", function(req, res){
    res.render('home');
});

app.post("/upload", function(req,res){
    var message = "";
    const validFileExtensions = "json"
    if(req.files){
        var file = req.files.filename, filename = file.name;
        if(filename.split('.').pop() !== validFileExtensions){
            console.log("You can only upload Json files.")
        }else{
            file.mv("../uploads/" + filename, function(err){
                if(err){
                    res.redirect('home');
                }else{
                    console.log("The file uploaded successfully.");
                    res.redirect('home');
                }
            });
        }
    }
});

//RENDER AN ERROR PAGE WHENEVER A USER VISITS AN NONEXISTING LINK
app.get("*", function(req, res){
    res.render('error_page');
});

