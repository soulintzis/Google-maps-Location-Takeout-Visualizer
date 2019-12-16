const express = require('express');
const router = express.Router();

let User = require('../models/User');

router.get('/register', function(req,res){
    res.render('signup')
    // var username = req.body.username;
    // var email = req.body.email;
    // var password = req.body.password;
    // var confirm = req.body.confirm;

    // var newUser = new User();
    // newUser.username = username;
    // newUser.email = email;
    // newUser.password = password;

    // newUser.save(function(err, savedUser){
    //     if(err){
    //         console.log(err);
    //         console.log("hello");
    //         return res.status(500).send();
    //     }
    //     return res.status(200).send();
    // });
});

module.exports = router;