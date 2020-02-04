const upload = require("express-fileupload");
const bodyParser = require("body-parser");
const passport = require('passport');
const bcrypt = require('bcryptjs');
const express = require('express');
const crypto = require('crypto');
const path = require('path');

const router = express.Router();

let User = require('../models/User');
require('../config/passport')(passport);

const auth = require('../scripts/authentication');
const parser = require('../scripts/parseJson');

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json());
router.use(passport.initialize());
router.use(passport.session());
router.use(upload());

//Login Form
router.get("/", auth.authenticationMiddleware(), function(req, res){
    res.render('login');
});

router.get("/login", function(req, res){
    res.render('login');
});

//Login Process
router.post("/login", function(req, res, next){
    let query = {username: req.body.username};
    User.findOne(query, function(err, user){
        if(user.admin === true){
            passport.authenticate('local', {
                successRedirect: '/admin/home',
                failureRedirect:'/'
            })(req, res, next);
        }else{
            passport.authenticate('local', {
                successRedirect: '/home',
                failureRedirect:'/'
            })(req, res, next);
        }
    });  
});

let restrictedAreas = '';

router.post("/restrictions", auth.authenticationMiddleware(), function(req, res) {
    restrictedAreas = req.body;
    console.log(restrictedAreas);
    res.send();
});

router.post("/upload", auth.authenticationMiddleware(), async function(req,res){
    let message = "";
    const validFileExtensions = "json";
    if(req.files){
        const file = req.files.files;
        const filename = file.name;
        console.log(filename);
        crypto.randomBytes(8, (err, buf) => {
            if(err){
                console.log(err);
            }
            const newFilename = buf.toString('hex') + path.extname(filename);
            if(filename.split('.').pop() !== validFileExtensions){
                    console.log("You can only upload Json files.")
            }else{
                file.mv("../uploads/" + newFilename,async function(err){
                    if(err){
                        console.log(err);
                    }else{
                        if(restrictedAreas != ''){
                            await parser.readJsonObjectFromFileExtra(newFilename, restrictedAreas, req.session.passport); 
                        }else{
                            await parser.readJsonObjectFromFile(newFilename, req.session.passport); 
                        }
                        console.log("The file uploaded successfully.");
                    }
                });
            }
            res.send();
        });
    }
});



router.get("/home", auth.authenticationMiddleware(), function(req, res){
    res.render('home');
});


router.get('/logout', auth.authenticationMiddleware(), async function(req, res){
    await req.session.destroy();
    req.logout();
    res.redirect('/');
});

module.exports = router;