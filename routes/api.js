const express = require('express');

const router = express.Router();

let User = require('../models/User');
let Location = require('../models/location');

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
    var obj_id = req.params.id;
    await Location.findOne({_id: obj_id}, (error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
});

router.get("/locations/:id", async (req, res) => {
    var id = req.params.id;
    await Location.find({user_id: id}, (error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
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