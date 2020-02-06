const express = require('express');

const router = express.Router();

let User = require('../models/User');
let Location = require('../models/location');

const auth = require('../scripts/authentication');

router.get("/users", async (req, res) => {
    await User.find({}, (error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
});

router.get("/user/:id", async (req, res) => {
    var obj_id = req.params.id;
    await User.findOne({_id: obj_id}, (error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
});

router.delete("/user/:id", async (req, res) => {
    var obj_id = req.params.id;
    await User.deleteOne({_id: obj_id}, (error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
});

router.get("/locations", async (req, res) => {
    await Location.find({}, (error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
});

router.get("/location/:id", async (req, res) => {
    let obj_id = req.params.id;
    await Location.findOne({_id: obj_id}, (error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
});

router.get("/locations/current_month/:id", async (req, res) => {
    let id = req.params.id;
    let date = new Date();
    let start_of_month = new Date(getStartOfMonthDateAsString(date)).getTime();
    console.log(start_of_month)
    await Location.find({user_id: id, timestampMs: { $gte: start_of_month}}, (error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
});

router.get("/locations/:id", async (req, res) => {
    let id = req.params.id;
    await Location.find({user_id: id}, (error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
});

function getStartOfMonthDateAsString(date) {        
    function zerosPad(number, numOfZeros) {
      var zero = numOfZeros - number.toString().length + 1;
      return Array(+(zero > 0 && zero)).join("0") + number;
    }
  
    var day = zerosPad(1, 2);
    var month = zerosPad((date.getMonth() + 1), 2);
    var year = date.getFullYear();
  
    return year + '-' + month + '-' + day + 'T00:00:00';
}


router.get("/current_user", auth.authenticationMiddleware(), async (req, res) => {
    current_user = req.user;
    res.send(current_user)
});

router.delete("/locations/:id", async (req, res) => {
    var id = req.params.id;
    await Location.deleteMany({user_id: id}, (error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
});

module.exports = router;
