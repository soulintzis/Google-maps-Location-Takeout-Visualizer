const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const config = require('./db');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

module.exports = function(passport){
    //Local Strategy
    passport.use(new LocalStrategy(function(username, password, done){
        //Match Username
        let query = {username: username};
        User.findOne(query, function(err, user){
            if(err){
                console.log(err);
                return;
            }
            if(!user){
                return done(null, false, { message: 'Invalid Username or Password. Please try again!'});
            }
            //Match Password
            bcrypt.compare(password, user.password, function(err, isMatched){
                if(err){
                    console.log(err);
                    return;
                }
                if(isMatched){
                    return done(null, user);
                }else{
                    return done(null, false, { message: 'Invalid Username or Password. Please try again!'});
                }
            });
        });
    }));

    passport.serializeUser(function(user, done){
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user){
            done(err, user);
        });
    });
}

