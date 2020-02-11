const express = require('express');

const router = express.Router();

let User = require('../models/User');
let Location = require('../models/location');

const auth = require('../scripts/authentication');


router.get("/records_per_user", async (req,res) => {
    await User.find({}, async (error, result) => {
        let doc = {
            username: String,
            num_of_docs: Number
        }
        if(error) {
            return res.status(500).send(error);
        }
        let records_per_user = [];
        console.log(result.length)
        for await(let user of result){
            await Location.countDocuments({user_id: user.user_id}, async (error, counter) => {
                if(error) {
                    return res.status(500).send(error);
                }
                doc = {
                    username: user.username,
                    num_of_docs: counter
                };
                console.log(doc)
                 records_per_user.push(doc);
            });
        }
        // console.log(records_per_user);
        res.send(records_per_user);
    });
});

router.get("/records_per_month", async (req, res) => {
    let num_of_records_per_month = [];
    let recs_of_month = {
        month_name: String,
        count: Number
    }
    await Location.find({}).sort({timestampMs: -1}).limit(1).exec(async function(error, date_until) {
        if(error) {
            return res.status(500).send(error);
        }
        let until = new Date(date_until[0].timestampMs);
        until.setTime( until.getTime() + until.getTimezoneOffset() * (-1) * 60 * 1000 )
        let end_year = until.getFullYear();
        await Location.find({}).sort({timestampMs: 1}).limit(1).exec(async function(error, date_from) {
            if(error) {
                return res.status(500).send(error);
            }
            const months = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
            ];
            let from = new Date(date_from[0].timestampMs);
            from.setTime(from.getTime() + from.getTimezoneOffset() * (-1) * 60 * 1000 )
            let start_year = from.getFullYear();
            for(let year = start_year; year <= end_year;year++){
                for(let month = 1; month <= 12;month++) {
                    let string_date_start = new Date(year + '-' + String((month < 10 ? '0' : '') + month) + '-01' + 'T00:00:00');
                    string_date_start.setTime(string_date_start.getTime() + string_date_start.getTimezoneOffset() * (-1) * 60 * 1000 );
                    let string_date_end = ''
                    if(month === 12) {
                        string_date_end = new Date(year, 11, 32);
                        string_date_end.setTime(string_date_end.getTime() + string_date_end.getTimezoneOffset() * -0.99999 * 60 * 1000);
                    }else{
                        new_month = month + 1;
                        string_date_end = new Date(year + '-' + String((new_month < 10 ? '0' : '') + new_month) + '-01' + 'T00:00:00');
                        string_date_end.setTime(string_date_end.getTime() + string_date_end.getTimezoneOffset() * -0.99999 * 60 * 1000);

                    }
                    await Location.countDocuments({timestampMs: { $gte: string_date_start.getTime(), $lte: string_date_end.getTime()}},(error, counter) => {
                        if(error) {
                            return res.status(500).send(error);
                        }
                        if (num_of_records_per_month.filter(e => e.month_name === months[month - 1]).length > 0) {
                            let index = num_of_records_per_month.findIndex(x => x.month_name === months[month-1]);
							num_of_records_per_month[index].count += counter;
                        }else{
                            recs_of_month = {
                                month_name: months[month-1],
                                count: counter
                            };
                            num_of_records_per_month.push(recs_of_month)
                        }
                    });                  
                }
            }
            res.send(num_of_records_per_month);
        });
    });
});

router.get("/records_per_day", auth.authenticationMiddlewareAdmin(), async (req, res) => {
    let num_of_records_per_day = [];
    let recs_of_day = {
        day_name: String,
        count: Number
    }
    await Location.find({}).sort({timestampMs: -1}).limit(1).exec(async function(error, date_until) {
        if(error) {
            return res.status(500).send(error);
        }
        let until = new Date(date_until[0].timestampMs);
        until.setTime( until.getTime() + until.getTimezoneOffset() * (-1) * 60 * 1000 )
        let end_year = until.getFullYear();
        await Location.find({}).sort({timestampMs: 1}).limit(1).exec(async function(error, date_from) {
            if(error) {
                return res.status(500).send(error);
            }
            const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
            let from = new Date(date_from[0].timestampMs);
            from.setTime(from.getTime() + from.getTimezoneOffset() * (-1) * 60 * 1000 )
            let start_year = from.getFullYear();
            for(let year = start_year; year <= end_year;year++){
                for(let month = 1; month <= 12;month++) {
                    for(let day = 1; day <= 31; day++) {
                        let string_date_start = new Date(year + '-' + String((month < 10 ? '0' : '') + month) + '-' + String((day < 10 ? '0' : '') + day) + 'T00:00:00');
                        string_date_start.setTime(string_date_start.getTime() + string_date_start.getTimezoneOffset() * (-1) * 60 * 1000 );
                        let string_date_end = new Date(year + '-' + String((month < 10 ? '0' : '') + month) + '-' + String((day < 10 ? '0' : '') + day) + 'T23:59:59');
                        string_date_end.setTime(string_date_end.getTime() + string_date_end.getTimezoneOffset() * -0.99999 * 60 * 1000);
                        // console.log(string_date_start, string_date_end);
                        await Location.countDocuments({timestampMs: { $gte: string_date_start.getTime(), $lte: string_date_end.getTime()}},(error, counter) => {
                            if(error) {
                                return res.status(500).send(error);
                            }
                            if (num_of_records_per_day.filter(e => e.day_name === days[(string_date_start.getDate()-1) % 7]).length > 0) {
                                let index = num_of_records_per_day.findIndex(x => x.day_name === days[(string_date_start.getDate()-1) % 7]);
                                num_of_records_per_day[index].count += counter;
                            }else{
                                recs_of_day = {
                                    day_name: days[(string_date_start.getDate()-1) % 7],
                                    count: counter
                                };
                                num_of_records_per_day.push(recs_of_day)
                            }
                        });     
                    }
                }
            }
            res.send(num_of_records_per_day);
        });
    });
});
router.get("/records_per_hour", async (req, res) => {
    let num_of_records_per_hour = [];
    let recs_of_hour = {
        hour: String,
        count: Number
    }
    await Location.find({}).sort({timestampMs: -1}).limit(1).exec(async function(error, date_until) {
        if(error) {
            return res.status(500).send(error);
        }
        let until = new Date(date_until[0].timestampMs);
        until.setTime( until.getTime() + until.getTimezoneOffset() * (-1) * 60 * 1000 )
        let end_year = until.getFullYear();
        await Location.find({}).sort({timestampMs: 1}).limit(1).exec(async function(error, date_from) {
            if(error) {
                return res.status(500).send(error);
            }
            let hours=[];
            for(let hour = 0; hour<24; hour++){
                let h =  String((hour < 10 ? '0' : '') + hour) + ':00';
                hours.push(h);
            }
            
            let from = new Date(date_from[0].timestampMs);
            from.setTime(from.getTime() + from.getTimezoneOffset() * (-1) * 60 * 1000 )
            let start_year = from.getFullYear();
            for(let year = start_year; year <= end_year;year++){
                for(let month = 1; month <= 12;month++) {
                    for(let day = 1; day <= 31; day++) {
                        for(let hour=0; hour<24; hour++){
                           
                            let string_date_start = new Date(year + '-' + String((month < 10 ? '0' : '') + month) + '-' + String((day < 10 ? '0' : '') + day) + 'T' + String((hour < 10 ? '0' : '') + hour) + ':00:00');
                            string_date_start.setTime(string_date_start.getTime() + string_date_start.getTimezoneOffset() * (-1) * 60 * 1000 );
                            let string_date_end = new Date(year + '-' + String((month < 10 ? '0' : '') + month) + '-' + String((day < 10 ? '0' : '') + day) + 'T' + String((hour < 10 ? '0' : '') + hour) + ':59:59');
                            string_date_end.setTime(string_date_end.getTime() + string_date_end.getTimezoneOffset() * -0.99999 * 60 * 1000);
                            await Location.countDocuments({timestampMs: { $gte: string_date_start.getTime(), $lte: string_date_end.getTime()}},(error, counter) => {
                                if(error) {
                                    return res.status(500).send(error);
                                }
                                if (num_of_records_per_hour.filter(e => e.hour === hours[(string_date_start.getHours())]).length > 0) {
                                    let index = num_of_records_per_hour.findIndex(x => x.hour === hours[(string_date_start.getHours())]);
                                    num_of_records_per_hour[index].count += counter;
                                }else{
                                    recs_of_hour = {
                                        hour: hours[(string_date_start.getHours())],
                                        count: counter
                                    };
                                    num_of_records_per_hour.push(recs_of_hour);
                                }
                            }); 
                        }    
                    }
                }
            }
            res.send(num_of_records_per_hour);
        });
    });
});

router.get("/records_per_year", async (req, res) => {
    let num_of_records_per_year = [];
    let recs_of_year = {
        year: String,
        count: Number
    }
    await Location.find({}).sort({timestampMs: -1}).limit(1).exec(async function(error, date_until) {
        if(error) {
            return res.status(500).send(error);
        }
        let until = new Date(date_until[0].timestampMs);
        until.setTime( until.getTime() + until.getTimezoneOffset() * (-1) * 60 * 1000 )
        let end_year = until.getFullYear();
        await Location.find({}).sort({timestampMs: 1}).limit(1).exec(async function(error, date_from) {
            if(error) {
                return res.status(500).send(error);
            }
            let from = new Date(date_from[0].timestampMs);
            from.setTime(from.getTime() + from.getTimezoneOffset() * (-1) * 60 * 1000 )
            let start_year = from.getFullYear();
            for(let year = start_year; year <= end_year;year++){
                let string_date_start = new Date(year + '-01-01'+ 'T00:00:00');
                string_date_start.setTime(string_date_start.getTime() + string_date_start.getTimezoneOffset() * (-1) * 60 * 1000 );
                let string_date_end = new Date(year + '-12-31'+ 'T23:59:59');
                string_date_end.setTime(string_date_end.getTime() + string_date_end.getTimezoneOffset() * -0.999999 * 60 * 1000);
                await Location.countDocuments({timestampMs: { $gte: string_date_start.getTime(), $lte: string_date_end.getTime()}},(error, counter) => {
                    if(error) {
                        return res.status(500).send(error);
                    }
                    if (num_of_records_per_year.filter(e => e.year === year).length > 0) {
                        let index = num_of_records_per_year.findIndex(x => x.year === year);
                        num_of_records_per_year[index].count += counter;
                    }else{
                        recs_of_year = {
                            year: year,
                            count: counter
                        };
                        num_of_records_per_year.push(recs_of_year)
                    }
                });     
            }
            res.send(num_of_records_per_year);  
        });
    });
});

router.get("/admin", auth.authenticationMiddlewareAdmin(), function(req, res){
    res.render('admin');
});

router.get("/records_per_type", async (req,res) => {
    await Location.find({}, async (error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        let activities = getActivities(result);
        let results = getTypesOfActivity(activities);
        res.send(results);
    });
});

router.delete("/locations", async (req, res) => {
    var obj_id = req.params.id;
    await Location.deleteMany({}, (error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
});

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


router.get("/logout_admin", auth.authenticationMiddlewareAdmin(), async function(req, res){
    await req.session.destroy();
    req.logout();
    res.redirect('/');
});

module.exports = router;