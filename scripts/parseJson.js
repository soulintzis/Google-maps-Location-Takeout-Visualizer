const fs = require('fs');
const filePath = '../uploads/'
const latitude_center = 38.2466395;
const longitude_center = 21.753150;

retrievedPolygons = [];

let User = require('../models/User');
let Location = require('../models/location');

module.exports = {
    readJsonObjectFromFile: (filename, pass) => {
        path = filePath + filename;
        locations = [];
        fs.readFile(path, (err, data) => {
            let inside_counter = 0;
            let outside_counter = 0;
            if(err) throw err;
            let jsonObj = JSON.parse(data);
            objId = pass.user;
            User.findById(objId, async function (err, user) { 
                for(item in jsonObj){
                    for(subItem in jsonObj[item]){
                        location = jsonObj[item][subItem];
                        var lat = location.latitudeE7/10000000;
                        var lon = location.longitudeE7/10000000;
                        if(module.exports.checkLocation(lat, lon) < 10.0) {
                            location.user_id = user.user_id;
                            locations.push(location);
                            inside_counter = inside_counter + 1;
                        }else{
                            outside_counter = outside_counter + 1;
                        }
                    }
                }
                console.log('Inside: ' + inside_counter);
                console.log('Outside: ' + outside_counter);
                Location.insertMany(locations)
                .then(function(mongooseDocuments) {
                    console.log("Your data was processed successfully");
                })
                .catch(function(err) {
                    console.log('An error occurred.')
                    console.log(err)
                });       
            });
        });
    },
    readJsonObjectFromFileExtra: (filename, restrictedLocations, pass) => {
        path = filePath + filename;
        let inside_counter = 0, outside_counter = 0;
        locations = [];
        fs.readFile(path, (err, data) => {
            if(err) throw err;
            let jsonObj = JSON.parse(data);
            objId = pass.user;
            User.findById(objId, function (err, user) { 
                for(item in jsonObj){
                    for(subItem in jsonObj[item]){
                        location = jsonObj[item][subItem];
                        var lat = location.latitudeE7/10000000;
                        var lon = location.longitudeE7/10000000;
                        var isInsidePolygon = false;
                        for(let pol of restrictedLocations){
                            if(module.exports.checkPolygon(pol, lat, lon)){
                                isInsidePolygon = !isInsidePolygon;
                                break;
                            }
                        }           
                        if(module.exports.checkLocation(lat, lon) < 10.0 & !isInsidePolygon) {
                            location.user_id = user.user_id;
                            locations.push(location);
                            inside_counter = inside_counter + 1;
                        }else{
                            outside_counter = outside_counter + 1;
                        }
                    }
                }
                console.log('Inside: ' + inside_counter);
                console.log('Outside: ' + outside_counter);
                var newLocation = new Location(location);
                newLocation.save(function(err, location){
                    if(err){
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
        const distance_latitude = module.exports.degrees_to_radians(latp - latitude_center);
        const distance_longitude = module.exports.degrees_to_radians(lonp - longitude_center);
        latp = module.exports.degrees_to_radians(latp);
        lonp = module.exports.degrees_to_radians(lonp);

        const a = Math.sin(distance_latitude/2) * Math.sin(distance_latitude/2) +
        Math.sin(distance_longitude/2) * Math.sin(distance_longitude/2) * Math.cos(latitude_center) * Math.cos(latp); 
                
        const b = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        const result = R * b;
        return result;
    },

    degrees_to_radians: (degrees) => {
        var pi = Math.PI;
        return degrees * (pi/180);
    },

    checkPolygon: (polygon, lat, lon) => {
        let isInside = false;
        for(let i = 0, j = polygon.length-1; i < polygon.length; j = i++){
            let xi = parseFloat(polygon[i].lat), yi = parseFloat(polygon[i].lng);
            let xj = parseFloat(polygon[j].lat), yj = parseFloat(polygon[j].lng);

            let intersect = ((yi > lon) != (yj > lon)) && (lat < ((xj - xi) * (lon - yi) / (yj - yi) + xi));

            if (intersect) {
                isInside = !isInside;
            }
        }
        return isInside;
    }

};
