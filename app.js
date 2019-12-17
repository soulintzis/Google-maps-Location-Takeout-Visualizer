const express = require("express");
const path = require('path');
const upload = require("express-fileupload");
const mongoose = require('mongoose');
const {check, validationResults} = require('express-validator');
const bodyParser = require("body-parser");

const PORT = 80;
const config = require('./config');
var app = express();

//Server start
app.listen(PORT, () => {
    console.log("The app is listening on port " +PORT);
});

mongoose.connect(config.dbUrl, {
    useNewUrlParser: true
});
mongoose.connection.on('connected', ()=>{
    console.log('Connected to mongo database.');
});

mongoose.connection.on('error', err => {
    console.log('Error at mongoDb: ' + err);
});

var users = require('./routes/users');
var index = require('./routes/index');

app.use('/', index);
app.use('/signup', users);  
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
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

app.get("*", function(req, res){
    res.render('error_page');
});

