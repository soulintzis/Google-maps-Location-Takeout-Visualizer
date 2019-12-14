var express = require("express");
const path = require('path');
var app = express();

app.set('view engine', 'ejs');
app.use('/css',express.static(path.join(__dirname, 'css')));
app.use('/images',express.static(path.join(__dirname, 'images')));
app.use('/scripts',express.static(path.join(__dirname, 'scripts')));
app.use('/views',express.static(path.join(__dirname, 'views')));

app.get("/", function(req, res){
    res.render('login');
});

app.get("/signup", function(req, res){
    res.render('signup');
});

app.get("*", function(req, res){
    res.render('error_page');
});

app.listen(80, () => {
    console.log("The app is listening on port 80.");
});