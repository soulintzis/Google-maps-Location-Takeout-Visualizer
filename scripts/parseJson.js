const fs = require("fs");
const filePath = "../uploads/";
const latitude_center = 38.2466395;
const longitude_center = 21.75315;

retrievedPolygons = [];

let User = require("../models/User");
let Location = require("../models/location");
let LeaderBoard = require("../models/leaderBoard");

module.exports = {
  readJsonObjectFromFile: (filename, pass) => {
    path = filePath + filename;
    locations = [];
    fs.readFile(path, (err, data) => {
      let inside_counter = 0;
      let outside_counter = 0;
      if (err) throw err;
      let jsonObj = JSON.parse(data);
      objId = pass.user;
      User.findById(objId, async function(err, user) {
        let user_id = user.user_id;
        for (item in jsonObj) {
          for (subItem in jsonObj[item]) {
            location = jsonObj[item][subItem];
            var lat = location.latitudeE7 / 10000000;
            var lon = location.longitudeE7 / 10000000;
            if (module.exports.checkLocation(lat, lon) < 10.0) {
              location.user_id = user_id;
              locations.push(location);
              inside_counter = inside_counter + 1;
            } else {
              outside_counter = outside_counter + 1;
            }
          }
        }
        console.log("Inside: " + inside_counter);
        console.log("Outside: " + outside_counter);
        Location.insertMany(locations)
          .then(function(mongooseDocuments) {
            console.log("Your data was processed successfully");
          })
          .catch(function(err) {
            console.log("An error occurred.");
            console.log(err);
          });
        var query = { _id: objId };
        let date = new Date();
        date.setTime(
          date.getTime() + date.getTimezoneOffset() * -1 * 60 * 1000
        );
        await User.updateOne(query, { lastUpload: date }, function(err, count) {
          if (err) return next(err);
        });
        await module.exports.getUsersActivityForLastMonth(user_id);
      });
    });
  },
  getStartOfMonthDateAsString: date => {
    function zerosPad(number, numOfZeros) {
      var zero = numOfZeros - number.toString().length + 1;
      return Array(+(zero > 0 && zero)).join("0") + number;
    }

    var day = zerosPad(1, 2);
    var month = zerosPad(date.getMonth() + 1, 2);
    var year = date.getFullYear();

    return year + "-" + month + "-" + day + "T00:00:00";
  },
  readJsonObjectFromFileExtra: (filename, restrictedLocations, pass) => {
    path = filePath + filename;
    let inside_counter = 0,
      outside_counter = 0;
    locations = [];
    fs.readFile(path, (err, data) => {
      if (err) throw err;
      let jsonObj = JSON.parse(data);
      objId = pass.user;
      User.findById(objId, function(err, user) {
        for (item in jsonObj) {
          for (subItem in jsonObj[item]) {
            location = jsonObj[item][subItem];
            var lat = location.latitudeE7 / 10000000;
            var lon = location.longitudeE7 / 10000000;
            var isInsidePolygon = false;
            for (let pol of restrictedLocations) {
              if (module.exports.checkPolygon(pol, lat, lon)) {
                isInsidePolygon = !isInsidePolygon;
                break;
              }
            }
            if (
              (module.exports.checkLocation(lat, lon) < 10.0) &
              !isInsidePolygon
            ) {
              location.user_id = user.user_id;
              locations.push(location);
              inside_counter = inside_counter + 1;
            } else {
              outside_counter = outside_counter + 1;
            }
          }
        }
        console.log("Inside: " + inside_counter);
        console.log("Outside: " + outside_counter);
        var newLocation = new Location(location);
        newLocation.save(function(err, location) {
          if (err) {
            console.log(err);
            return;
          }
        });
      });
    });
  },
  //This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
  checkLocation: (latp, lonp) => {
    const R = 6371; // Radius of the earth in km
    const distance_latitude = module.exports.degrees_to_radians(
      latp - latitude_center
    );
    const distance_longitude = module.exports.degrees_to_radians(
      lonp - longitude_center
    );
    latp = module.exports.degrees_to_radians(latp);
    lonp = module.exports.degrees_to_radians(lonp);

    const a =
      Math.sin(distance_latitude / 2) * Math.sin(distance_latitude / 2) +
      Math.sin(distance_longitude / 2) *
        Math.sin(distance_longitude / 2) *
        Math.cos(latitude_center) *
        Math.cos(latp);

    const b = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const result = R * b;
    return result;
  },

  degrees_to_radians: degrees => {
    var pi = Math.PI;
    return degrees * (pi / 180);
  },

  checkPolygon: (polygon, lat, lon) => {
    let isInside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      let xi = parseFloat(polygon[i].lat),
        yi = parseFloat(polygon[i].lng);
      let xj = parseFloat(polygon[j].lat),
        yj = parseFloat(polygon[j].lng);

      let intersect =
        yi > lon != yj > lon && lat < ((xj - xi) * (lon - yi)) / (yj - yi) + xi;

      if (intersect) {
        isInside = !isInside;
      }
    }
    return isInside;
  },
  getUsersActivityForLastMonth: async id => {
    from_date = new Date(
      module.exports.getStartOfMonthDateAsString(new Date())
    );
    from_date.setTime(
      from_date.getTime() + from_date.getTimezoneOffset() * -1 * 60 * 1000
    );
    Location.aggregate([
      { $unwind: "$activity" },
      { $unwind: "$activity.activity" },
      {
        $match: {
          user_id: id,
          timestampMs: { $gte: new Date(from_date) },
          "activity.activity.type": {
            $not: { $regex: "STILL|UNKNOWN|TILTING|EXITING_VEHICLE" }
          },
          "activity.activity.confidence": { $gte: 65 }
        }
      },
      {
        $group: {
          _id: "$activity.activity.type",
          counter: { $sum: 1 }
        }
      }
    ]).exec(async (err, result) => {
      if (err) throw err;
      let eco_counter = 0;
      for (let item of result) {
        if (
          item._id === "WALKING" ||
          item._id === "ON_FOOT" ||
          item._id === "RUNNING" ||
          item._id === "ON_BICYCLE"
        ) {
          eco_counter += item.counter;
        }
      }
      await User.findOne({ user_id: id }, async (err, user) => {
        await LeaderBoard.findOne(
          { username: user.username },
          async (err, leader) => {
            if (leader === null) {
                var new_leaderBoard = new LeaderBoard({
                    username: user.username,
                    eco_score: eco_counter
                  });
                await new_leaderBoard.save(function(err, user) {
                if (err) {
                  console.log(err);
                  return;
                }
              });
            } else {
              await LeaderBoard.updateOne(
                { username: user.username },
                { eco_score: eco_counter },
                function(err, count) {
                  if (err) return console.log(err);
                }
              );
            }
          }
        );
        console.log(eco_counter);
      });
    });
  }
};
