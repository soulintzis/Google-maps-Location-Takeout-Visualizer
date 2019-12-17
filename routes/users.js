const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const bodyParser = require("body-parser");
const {check, validationResult} = require('express-validator');

let User = require('../models/user');

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json());

router.get('/', function(req,res){
    res.render('signup');
});

router.post("/register", [
    check('username').not().isEmpty(),
    check('email').isEmail(),
    check('password').not().isEmpty()
    ], function(req, res){

    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const confirm = req.body.confirm;

    let errors = validationResult(req);

    if(!errors.isEmpty()){
        res.render('signup', {
            errors: errors
        });
    } else {
        var newUser = new User({
            username: username,
            email: email,
            password: password
        });

        bcrypt.genSalt(10, function(err, salt){
            bcrypt.hash(newUser.password, salt, function(err, hash){
                if(err){
                    console.log(err);
                }
                newUser.password = hash;
                newUser.save(function(err, user){
                    if(err){
                        console.log(err);
                        return;
                    }else{
                        // res.render('/');
                        res.redirect('/');
                        console.log('You successfully create an account');
                    }
                });
            });
        });
    }
});

module.exports = router;