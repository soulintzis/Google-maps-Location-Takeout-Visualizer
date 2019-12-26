const {check, validationResults} = require('express-validator');
const upload = require("express-fileupload");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const passport = require('passport');
const express = require("express");
const crypto = require('crypto');
const path = require('path');

var app = express();

const parser = require('./scripts/parseJson');

const PORT = 3000;

//Database Config
const db = require('./config/db');

//Server Start
app.listen(PORT, () => {
    console.log("The app is listening on port " + PORT);
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

app.post("/api", function(req, res) {
    restrictedAreas = {
        polygons: []
    }
    const obj = req.body;
    obj.angles.forEach(element => {
        areas = [];
        for(var i=0;i<element;i++){
            areas.push(obj.coordinates[i]);
        }
        restrictedAreas.polygons.push(areas);
    });
    // console.log(restrictedAreas);
});

app.post("/upload", function(req,res){
    let message = "";
    const validFileExtensions = "json"
    console.log(restrictedAreas)
    if(req.files){
        const file = req.files.filename, filename = file.name;
        // console.log(file);
        crypto.randomBytes(8, (err, buf) => {
            if(err){
                console.log(err);
            }
            const newFilename = buf.toString('hex') + path.extname(filename);
            if(filename.split('.').pop() !== validFileExtensions){
                console.log("You can only upload Json files.")
            }else{
                file.mv("../uploads/" + newFilename, function(err){
                if(err){
                        console.log(err);
                        res.redirect('home');
                    }else{
                        if(restrictedAreas.polygons != ''){
                            parser.readJsonObjectFromFileExtra(newFilename, restrictedAreas); 
                        }else{
                            parser.readJsonObjectFromFile(newFilename); 
                        }
                        console.log("The file uploaded successfully.");
                        res.redirect('home');
                    }
                });
            }
        });
    }
});

//RENDER AN ERROR PAGE WHENEVER A USER VISITS AN NONEXISTING LINK
app.get("*", function(req, res){
    res.render('error_page');
});


// var dataSchema = new mongoose.Schema({
//     timestampMs : Number,
//     latitude : Number,
//     longitude : Number,
//     accuracy : Number,
//     activity : [ new mongoose.Schema({
//         timestampMs : Number,
//         activity : [ new mongoose.Schema({
//             type: String,
//             confidence: Number
//         },{strict: false})
//         ]
//     },{strict: false})
//     ]
// },{strict: false});