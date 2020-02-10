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
    await Location.find({user_id: id, timestampMs: { $gte: start_of_month}}, (error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
});

router.get("/locations/:from_day/:from_month/:from_year/:id", async (req, res) => {
    let id = req.params.id;
    let day = req.params.from_day, month = req.params.from_month, year = req.params.from_year;
    let from_date = year + '-' + month + '-' + day + 'T00:00:00';
    let from = new Date(from_date).getTime();
    console.log(from_date);
    await Location.find({user_id: id, timestampMs: { $gte: from}}, (error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
});

router.get("/locations/:from_day/:from_month/:from_year/:until_day/:until_month/:until_year", auth.authenticationMiddleware(), async (req, res) => {
    let id = req.user.user_id;
    let from_day = req.params.from_day, from_month = req.params.from_month, from_year = req.params.from_year;
    let until_day = req.params.until_day, until_month = req.params.until_month, until_year = req.params.until_year;
    let action = req.params.type
    let from_date = from_year + '-' + from_month + '-' + from_day + 'T00:00:00';
    let until_date = until_year + '-' + until_month + '-' + until_day + 'T00:00:00';
    let from = new Date(from_date).getTime();
    let until = new Date(until_date).getTime();
    await Location.find({user_id: id, timestampMs: { $gte: from, $lte: until}}, (error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
            res.send(results);
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
        res.send(result);
    });
});


router.get("/current_user", auth.authenticationMiddleware(), async (req, res) => {
    current_user = req.user;
    res.send(current_user);
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


router.get("/locations/get_eco_score/:id", async (req, res) => {
    let id = req.params.id;
    await Location.find({user_id: id}, (error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        let activities = getActivities(result);
        let counters = getEcoScore(activities);
        res.send(counters);
    });
});

router.get("/:from_day/:from_month/:from_year/:until_day/:until_month/:until_year/get_busiest_hour_of_the_day", auth.authenticationMiddleware(), async (req, res) => {
    let id = req.user.user_id;
    let from_day = req.params.from_day, from_month = req.params.from_month, from_year = req.params.from_year;
    let until_day = req.params.until_day, until_month = req.params.until_month, until_year = req.params.until_year;
    let from_date = from_year + '-' + from_month + '-' + from_day + 'T00:00:00';
    let until_date = until_year + '-' + until_month + '-' + until_day + 'T00:00:00';
    let from = new Date(from_date).getTime();
    let until = new Date(until_date).getTime();        
    await Location.find({user_id: id, timestampMs: { $gte: from, $lte: until}},(error, result) => {        if(error) {
            return res.status(500).send(error);
        }
        let activities = getActivities(result);
        let results = getBusiestHour(activities);
        res.send(results);
    });
});

router.get("/:from_day/:from_month/:from_year/:until_day/:until_month/:until_year/get_busiest_day_of_the_week/", auth.authenticationMiddleware(), async (req, res) => {
    let id = req.user.user_id;
    let from_day = req.params.from_day, from_month = req.params.from_month, from_year = req.params.from_year;
    let until_day = req.params.until_day, until_month = req.params.until_month, until_year = req.params.until_year;
    let from_date = from_year + '-' + from_month + '-' + from_day + 'T00:00:00';
    let until_date = until_year + '-' + until_month + '-' + until_day + 'T00:00:00';
    let from = new Date(from_date).getTime();
    let until = new Date(until_date).getTime();    
    await Location.find({user_id: id, timestampMs: { $gte: from, $lte: until}},(error, result) => {        
        if(error) {
            return res.status(500).send(error);
        }
        let activities = getActivities(result);
        let results = getBusiestDay(activities);
        res.send(results);
    });
});

router.get("/:from_day/:from_month/:from_year/:until_day/:until_month/:until_year/get-types-of-activity", auth.authenticationMiddleware(), async (req, res) => {
    let id = req.user.user_id;
    let from_day = req.params.from_day, from_month = req.params.from_month, from_year = req.params.from_year;
    let until_day = req.params.until_day, until_month = req.params.until_month, until_year = req.params.until_year;
    let from_date = from_year + '-' + from_month + '-' + from_day + 'T00:00:00';
    let until_date = until_year + '-' + until_month + '-' + until_day + 'T00:00:00';
    let from = new Date(from_date).getTime();
    let until = new Date(until_date).getTime();
    await Location.find({user_id: id, timestampMs: { $gte: from, $lte: until}},(error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        let activities = getActivities(result);
        let results = getTypesOfActivity(activities);
        res.send(results);
    });
});

router.get("/locations/:id", auth.authenticationMiddleware(), async (req, res) => {
    // let id = req.user.user_id;
    let id = req.params.id;

    await Location.find({user_id: id}, async (error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        // let latLon = getLatAndLon();
        // console.log(latLon)
        res.send(results);
    });
});

router.get("/records_per_user", async (req,res) => {
    await User.find({}, async (error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        let records_per_user = [];
        for(let user of result){
            await Location.countDocuments({user_id: user.user_id}, async (error, counter) => {
                if(error) {
                    return res.status(500).send(error);
                }
                let doc = {
                    username: user.username,
                    num_of_docs: counter
                };
                records_per_user.push(doc);
            });
        }
        res.send(records_per_user);
    });
});

router.get("/records_per_month", async (req, res) => {
    
    await Location.find({}).sort({timestampMs: -1}).limit(1).exec(async function(error, date_until) {
        if(error) {
            return res.status(500).send(error);
        }
        let until = new Date(date_until[0].timestampMs).getTime();
        await Location.find({}).sort({timestampMs: 1}).limit(1).exec(async function(error, date_from) {
            if(error) {
                return res.status(500).send(error);
            }
            let from = new Date(date_from[0].timestampMs).getTime();
            console.log(from, until);
            for(let year = from.getFullYear(); year <= until.getFullYear(); year++){
                for(let month = from.getMonth() + 1; month <= until.getMonth() + 1; month++){
                    let date = new Date(getStartOfMonthDateAsString(date)).getTime();
                    console.log(date)
                }
            }
        });
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

function getBusiestHour(activities){
	let busiestHours =[];
	let activity = {
		type: String,
		hours: [{
			hour: Number,
			counter: Number
		}]
	}
	for(let item of activities){
		for(let act of item){
			let timestamp = act.timestampMs;
			let date = new Date(timestamp);
			let hour = date.getHours();
			for(let final_obj of act.activity){
				if (!(
					final_obj.type === "STILL" ||
					final_obj.type === "TILTING" ||
					final_obj.type === "UNKNOWN" ||
					final_obj.type === 'EXITING_VEHICLE'
				) && final_obj.confidence >= 65) {
						if (busiestHours.filter(e => e.type === final_obj.type).length > 0) {
							index = busiestHours.findIndex(x => x.type === final_obj.type);
							if(busiestHours[index].hours.filter(e => e.hour === hour).length > 0) {
								hour_index = busiestHours[index].hours.findIndex(x => x.hour === hour);
								busiestHours[index].hours[hour_index].counter += 1;
							}else{
								index = busiestHours.findIndex(x => x.type === final_obj.type);
								new_hour =	{
									hour: hour,
									counter: 1
								};
								busiestHours[index].hours.push(new_hour);
							}
						} else {
							activity = {
								type: final_obj.type,
								hours: [
									{
										hour: hour,
										counter: 1
									}
								]
							}
							busiestHours.push(activity);
						}
						break;
				}else {
					continue;
				}
			}			
		}
	}
	return busiestHours;
}

function getBusiestDay(activities){
	let busiestDays =[]
	let activity = {
		type: String,
		days: [{
			day: String,
			counter: Number
		}]
	}
	for(let item of activities){
		for(let act of item){
			let timestamp = act.timestampMs;
			let date = new Date(timestamp);
			let day = date.getDay();
			for(let final_obj of act.activity){
				if (!(
					final_obj.type === "STILL" ||
					final_obj.type === "TILTING" ||
					final_obj.type === "UNKNOWN" ||
					final_obj.type === 'EXITING_VEHICLE'
				) && final_obj.confidence >= 65) {
						if (busiestDays.filter(e => e.type === final_obj.type).length > 0) {
							index = busiestDays.findIndex(x => x.type === final_obj.type);
							if(busiestDays[index].days.filter(e => e.day === day).length > 0) {
								day_index = busiestDays[index].days.findIndex(x => x.day === day);
								busiestDays[index].days[day_index].counter += 1;
							}else{
								index = busiestDays.findIndex(x => x.type === final_obj.type);
								new_day =	{
									day: day,
									counter: 1
								};
								busiestDays[index].days.push(new_day);
							}
						} else {
							activity = {
								type: final_obj.type,
								days: [
									{
										day: day,
										counter: 1
									}
								]
							};
							busiestDays.push(activity);
						}
						break;
				}else {
					continue;
				}
			}			
		}
	}
	return busiestDays;
}

function getTypesOfActivity(activities){
	let typesOfActivities =[]
	activity = {
		type: String,
		counter: Number
	};
	for(let item of activities){
		for(let act of item){
			for(let final_obj of act.activity){
				if (!(
					final_obj.type === "STILL" ||
					final_obj.type === "TILTING" ||
					final_obj.type === "UNKNOWN" ||
					final_obj.type === 'EXITING_VEHICLE'
				) && final_obj.confidence >= 65) {
						if (typesOfActivities.filter(e => e.type === final_obj.type).length > 0) {
							index = typesOfActivities.findIndex(x => x.type === final_obj.type);
							typesOfActivities[index].counter += 1;
						} else {
							activity = {
								type: final_obj.type,
								counter: 1
							};
							typesOfActivities.push(activity);
						}
						break;
				}else {
					continue;
				}
			}			
		}
    }
	return typesOfActivities;
}

function getLatAndLon(locations) {
	let points = [];
	let location = {
		latitude: Number,
		longitude: Number
	}
	for(let item of locations){
		let loc =  {
			latitude: item.latitudeE7/10000000,
			longitude: item.longitudeE7/10000000
		};
		points.push(loc);
	}
	return points;
}


module.exports = router;
