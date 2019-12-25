const bodyParser = require("body-parser");
const passport = require('passport');
const bcrypt = require('bcryptjs');
const express = require('express');

const router = express.Router();

let User = require('../models/User');

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json());

router.use(passport.initialize());

//Login Form
router.get("/", function(req, res){
    res.render('login');
});

//Login Process
router.post("/", function(req, res, next){
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

module.exports = router;