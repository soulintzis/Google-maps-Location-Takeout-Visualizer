const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const bodyParser = require("body-parser");

let User = require('../models/user');

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json());

router.get("/", function(req, res){
    res.render('login');
});

module.exports = router;