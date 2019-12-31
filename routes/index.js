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

router.get("/profile", auth.authenticationMiddleware(), function(req, res){
    res.render('profile');
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

router.post("/restrictions", auth.authenticationMiddleware(), function(req, res) {
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

router.post("/upload", auth.authenticationMiddleware(), function(req,res){
    let message = "";
    const validFileExtensions = "json";
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
                            parser.readJsonObjectFromFileExtra(newFilename, restrictedAreas, req.session.passport); 
                        }else{
                            parser.readJsonObjectFromFile(newFilename, req.session.passport); 
                        }
                        console.log("The file uploaded successfully.");
                        res.redirect('home');
                    }
                });
            }
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