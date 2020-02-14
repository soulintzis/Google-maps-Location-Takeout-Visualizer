const express = require("express");

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

module.exports = router;
