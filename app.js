var express = require("express");
const path = require('path');
var upload = require("express-fileupload");
var app = express();

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

app.listen(80, () => {
    console.log("The app is listening on port 80.");
});
