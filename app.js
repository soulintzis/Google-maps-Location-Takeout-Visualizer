const {check, validationResults} = require('express-validator');
const upload = require("express-fileupload");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const express = require("express");
const path = require('path');
var app = express();

const PORT = 80;
const config = require('./config');

//SERVER START
app.listen(PORT, () => {
    console.log("The app is listening on port " +PORT);
});

//CONNECT TO MONGODB AND CHECK FOR ERRORS
mongoose.connect(config.dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.on('connected', ()=>{
    console.log('Connected to mongo database.');
});
mongoose.connection.on('error', err => {
    console.log('Error at mongoDb: ' + err);
});

//ROUTE PATHS
var users = require('./routes/users');
var index = require('./routes/index');

//ROUTES
app.use('/', index);
app.use('/signup', users);  

// SET EJS AS VIEW ENGINE
app.set('view engine', 'ejs');

//SETUP BODY PARSER
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

//SET STATIC FOLDERS
app.use('/css',express.static(path.join(__dirname, 'css')));
app.use('/images',express.static(path.join(__dirname, 'images')));
app.use('/scripts',express.static(path.join(__dirname, 'scripts')));
app.use('/views',express.static(path.join(__dirname, 'views')));

app.use(upload());


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

