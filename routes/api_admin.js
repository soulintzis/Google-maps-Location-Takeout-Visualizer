const express = require("express");
let fs = require("fs");
let path = require("path");
let http = require('http').Server(express);

const router = express.Router();

let User = require("../models/User");
let Location = require("../models/location");

const auth = require("../scripts/authentication");

router.delete("/delete_data", async (req, res) => {
  var obj_id = req.params.id;
  await Location.deleteMany({}, (error, result) => {
    if (error) {
      return res.status(500).send(error);
    }
    console.log("Data was deleted");
    res.send(result);
  });
});
router.get("/heatmap_locations", async (req, res) => {
  let lat_and_lngs = [];
  let location = {
    lat: Number,
    lng: Number,
    counter: Number
  };
  await Location.find({}, async (error, result) => {
    if (error) {
      return res.status(500).send(error);
    }
    for (let item of result) {
      location = {
        lat: item.latitudeE7 / 10000000,
        lng: item.longitudeE7 / 10000000,
        counter: 1
      };
      lat_and_lngs.push(location);
    }
    res.send(lat_and_lngs);
  });
});

router.get("/records_per_day", async (req, res) => {
  Location.aggregate([
    { $unwind: "$activity" },
    { $unwind: "$activity.activity" },
    {
      $match: {
        "activity.activity.type": {
          $not: { $regex: "STILL|UNKNOWN|TILTING|EXITING_VEHICLE" }
        },
        "activity.activity.confidence": { $gte: 65 }
      }
    },
    { $project: { day: { $dayOfMonth: "$timestampMs" } } },
    // Find average for each month
    { $group: { _id: "$day", counter: { $sum: 1 } } }
  ]).exec((err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

router.get("/records_per_month", async (req, res) => {
  Location.aggregate([
    { $unwind: "$activity" },
    { $unwind: "$activity.activity" },
    {
      $match: {
        "activity.activity.type": {
          $not: { $regex: "STILL|UNKNOWN|TILTING|EXITING_VEHICLE" }
        },
        "activity.activity.confidence": { $gte: 65 }
      }
    },
    // Grab the month of the timestamp
    { $project: { month: { $month: "$timestampMs" } } },
    // Find average for each month
    { $group: { _id: "$month", counter: { $sum: 1 } } }
  ]).exec((err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

router.get("/records_per_year", async (req, res) => {
  Location.aggregate([
    { $unwind: "$activity" },
    { $unwind: "$activity.activity" },
    {
      $match: {
        "activity.activity.type": {
          $not: { $regex: "STILL|UNKNOWN|TILTING|EXITING_VEHICLE" }
        },
        "activity.activity.confidence": { $gte: 65 }
      }
    },
    // Grab the month of the timestamp
    { $project: { year: { $year: "$timestampMs" } } },
    // Find average for each month
    { $group: { _id: "$year", counter: { $sum: 1 } } }
  ]).exec((err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

router.get("/records_per_hour", async (req, res) => {
  Location.aggregate([
    { $unwind: "$activity" },
    { $unwind: "$activity.activity" },
    {
      $match: {
        "activity.activity.type": {
          $not: { $regex: "STILL|UNKNOWN|TILTING|EXITING_VEHICLE" }
        },
        "activity.activity.confidence": { $gte: 65 }
      }
    },
    // Grab the month of the timestamp
    { $project: { hour: { $hour: "$timestampMs" } } },
    // Find average for each month
    { $group: { _id: "$hour", counter: { $sum: 1 } } }
  ]).exec((err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

router.get("/records_per_type", async (req, res) => {
  Location.aggregate([
    { $unwind: "$activity" },
    { $unwind: "$activity.activity" },
    {
      $match: {
        "activity.activity.type": {
          $not: { $regex: "STILL|UNKNOWN|TILTING|EXITING_VEHICLE" }
        },
        "activity.activity.confidence": { $gte: 65 }
      }
    },
    // Grab the month of the timestamp
    {
      $group: {
        _id: "$activity.activity.type",
        counter: { $sum: 1 }
      }
    }
  ]).exec((err, result) => {
    if (err) throw err;
    console.log(result);
    res.send(result);
  });
});

router.get("/records_per_user", async (req, res) => {
  Location.aggregate([
    { $group: { _id: "$user_id", counter: { $sum: 1 } } }
  ]).exec((err, result) => {
    if (err) throw err;
    console.log(result);
    res.send(result);
  });
});

router.get("/export_to_json", async (req, res, next) => {
  let data;
  Location.find({}).exec(async function(err, result) {
    data = JSON.stringify(result, null, 4);
    let filename = 'data.json';
    let absPath = path.join(__dirname, '../exports/', filename);
    let relPath = path.join('./exports', filename); // path relative to server root
    console.log(absPath, relPath)
    await fs.writeFile(relPath, data, async (err) => {
      if (err) {
        console.log(err);
      }
      await res.download(absPath, async (err) => {
        if (err) {
          console.log(err);
        }
        console.log("Downloaded")
        await fs.unlink(relPath, (err) => {
          if (err) {
            console.log(err);
          }
          console.log('FILE [' + filename + '] REMOVED!');
        });
      });
    });
  });
});

router.get("/:from_day/:from_month/:from_year/:until_day/:until_month/:until_year/export_to_json", async (req, res) => {
  let data;
  let from_day = req.params.from_day,
      from_month = req.params.from_month,
      from_year = req.params.from_year;
  let until_day = req.params.until_day,
      until_month = req.params.until_month,
      until_year = req.params.until_year;
  let from_date = from_year + "-" + from_month + "-" + from_day + "T02:00:00";
  let until_date = until_year + "-" + until_month + "-" + until_day + "T02:00:00";
  Location.find({timestampMs: { $gte: from_date, $lte: until_date }}).exec(function(err, result) {
    data = JSON.stringify(result, null, 4);
    fs.writeFile("../exports/data.json", data, function(err, res) {
      if (err) {
        console.log("error writing /data/people.json");
      } else {
        console.log("JSON file written to exports/data/data.json");
            }
    });
  });
});


router.get("/:type_of_activity/export_to_json", async (req, res) => {
  let data;
  let type = req.params.type_of_activity;
  Location.aggregate([
    { $unwind: "$activity" },
    { $unwind: "$activity.activity" },
    {
      $match: {
        "activity.activity.type": {
          $regex: type
        }
      }
    },
  ]).exec((err, result) => {
    if (err) throw err;
    data = JSON.stringify(result, null, 4);
    fs.writeFile("../exports/data.json", data, function(err, res) {
      if (err) {
        console.log("error writing /data/people.json");
      } else {
        console.log("JSON file written to exports/data/data.json");
      }
    });
  });
});

router.get("/:from_day/:from_month/:from_year/:until_day/:until_month/:until_year/:type_of_activity/export_to_json", async (req, res) => {
  let data;
  let type = req.params.type_of_activity;
  let from_day = req.params.from_day,
      from_month = req.params.from_month,
      from_year = req.params.from_year;
  let until_day = req.params.until_day,
      until_month = req.params.until_month,
      until_year = req.params.until_year;
  let from_date = from_year + "-" + from_month + "-" + from_day + "T02:00:00";
  let until_date = until_year + "-" + until_month + "-" + until_day + "T02:00:00";
  Location.aggregate([
    { $unwind: "$activity" },
    { $unwind: "$activity.activity" },
    {
      $match: {
        "activity.activity.type": {
          $regex: type
        },
        timestampMs: {
          $gte: new Date(from_date),
          $lte: new Date(until_date)
        }
      }
    },
  ]).exec((err, result) => {
    if (err) throw err;
    data = JSON.stringify(result, null, 4);
    fs.writeFile("../exports/data.json", data, function(err, res) {
      if (err) {
        console.log("error writing /data/people.json");
      } else {
        console.log("JSON file written to exports/data/data.json");
      }
    });
  });
});

module.exports = router;
