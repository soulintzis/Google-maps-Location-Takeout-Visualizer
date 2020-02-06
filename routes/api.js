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
        // console.log(result)
        res.send(result);
    });
});

router.get("/locations/current_month/:id", async (req, res) => {
    let id = req.params.id;
    let date = new Date();
    let start_of_month = new Date(getStartOfMonthDateAsString(date)).getTime();
    await Location.find({user_id: id, timestampMs: { $gte: start_of_month}}, (error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
});

router.get("/locations/get_eco_score/:id", async (req, res) => {
    let id = req.params.id;
    await Location.find({user_id: id}, (error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        let activities = getActivities(result);
        let counters = getEcoScore(activities)
        res.send(counters);
    });
});

router.get("/locations/:from_day/:from_month/:from_year/:id", async (req, res) => {
    let id = req.params.id;
    let day = req.params.from_day, month = req.params.from_month, year = req.params.from_year;
    let from_date = year + '-' + month + '-' + day + 'T00:00:00';
    let from = new Date(from_date).getTime();
    console.log(from)
    await Location.find({user_id: id, timestampMs: { $gte: from}}, (error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        console.log(result);
        res.send(result);
    });
});

router.get("/locations/:from_day/:from_month/:from_year/:until_day/:until_month/:until_year/:id", async (req, res) => {
    let id = req.params.id;
    let from_day = req.params.from_day, from_month = req.params.from_month, from_year = req.params.from_year;
    let until_day = req.params.until_day, until_month = req.params.until_month, until_year = req.params.until_year;
    let from_date = from_year + '-' + from_month + '-' + from_day + 'T00:00:00';
    let until_date = until_year + '-' + until_month + '-' + until_day + 'T00:00:00';
    let from = new Date(from_date).getTime();
    let until = new Date(until_date).getTime();
    console.log(from, until);
    await Location.find({user_id: id, timestampMs: { $gte: from, $lte: until}}, (error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        // console.log(result);
        res.send(result);
    });
});

router.get("/location/max_timestamp/:id", async (req, res) => {
    let id = req.params.id;
    await Location.find({user_id: id}).sort({timestampMs: -1}).limit(1).exec(async function(error, result) {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
});

router.get("/location/min_timestamp/:id", async (req, res) => {
    let id = req.params.id;
    await Location.find({user_id: id}).sort({timestampMs: 1}).limit(1).exec(async function(error, result) {
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
        console.log(result)
        res.send(result);
    });
});

router.get("/activities/:id", async (req, res) => {
    let id = req.params.id;

    await Location.find({user_id: id}, async (error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        let activities = await getActivities(result);
        console.log(activities[0][1])
        res.send(activities);
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

function getActivities(data) {
    let activities = [];
    for (let item of data) {
        if (item.activity.length !== 0) {
            activities.push(item.activity);
        } else {
            continue;
        }
    }       
    return activities;
}

function getEcoScore(activities) {
    let eco_counter = 0,
    non_eco_counter = 0;
for (let item of activities) {
    for (let activity of item) {
        for (let final_obj of activity.activity) {
            if (
                (final_obj.type === "WALKING" ||
                final_obj.type === "ON_FOOT" ||
                final_obj.type === "RUNNING" ||
                final_obj.type === "ON_BICYCLE") &&
                final_obj.confidence > 65
            ) {
                eco_counter = eco_counter + 1;
                break;
            } else if (
                (final_obj.type === "IN_ROAD_VEHICLE" ||
                    final_obj.type === "EXITING_VEHICLE" ||
                    final_obj.type === "IN_RAIL_VEHICLE" ||
                    final_obj.type === "IN_VEHICLE") &&
                final_obj.confidence > 65
            ) {
                non_eco_counter = non_eco_counter + 1;
                break;
            } else if (
                final_obj.type === "STILL" ||
                final_obj.type === "TILTING" ||
                final_obj.type === "UNKNOWN"
            ) {
                continue;
            }
        }
    }
}

return {
    eco_counter,
    non_eco_counter
};
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
