const {check, validationResult} = require('express-validator');
const bodyParser = require("body-parser");
const passport = require('passport');
const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const router = express.Router();

//Passport Config
require('../config/passport')(passport);

let User = require('../models/User');

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json());

router.use(passport.initialize());
router.use(passport.session());

//Signup Form
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

    let id = '';

    let errors = validationResult(req);

    if(!errors.isEmpty()){
        res.render('signup', {
            errors: errors
        });
    } else {
        let newUser = new User({
            username: username,
            email: email,
            password: password,
            user_id: id
        });

        //Create a user_id that only the user himself can decipher using his password
        let key = crypto.createCipher('aes-128-cbc', password);
        id = key.update(email, 'utf8', 'hex')
        id += key.final('hex');
        newUser.user_id = id;

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
                        res.redirect('/');
                        console.log('You successfully create an account');
                    }
                });
            });
        });
    }
});


module.exports = router;

//Decipher Documentation
// var mykey = crypto.createDecipher('aes-128-cbc', 'mypassword');
// var mystr = mykey.update('34feb914c099df25794bf9ccb85bea72', 'hex', 'utf8')
// mystr += mykey.final('utf8');