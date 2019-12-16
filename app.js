const express = require("express");
const path = require('path');
const upload = require("express-fileupload");
const mongoose = require('mongoose');

const PORT = 3000;


const app = express();

app.listen(PORT, () => {
    console.log("The app is listening on port " +PORT);
});

mongoose.connect('mongodb+srv://admin:e74d42x75@webapp-vuzaa.gcp.mongodb.net/test?retryWrites=true&w=majority');
let db = mongoose.connection;

db.once('open', function(){
    console.log("Connected to MongoDB");
});

db.on('error', function(err){
    console.log(err);
});

app.set('view engine', 'ejs');
app.use('/css',express.static(path.join(__dirname, 'css')));
app.use('/images',express.static(path.join(__dirname, 'images')));
app.use('/scripts',express.static(path.join(__dirname, 'scripts')));
app.use('/views',express.static(path.join(__dirname, 'views')));
app.use(upload());

app.get("/", function(req, res){
    res.render('login');
});

app.get("/signup", function(req, res){
    var username = ['vagos', 'jim'];
    res.render('signup');
});

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

