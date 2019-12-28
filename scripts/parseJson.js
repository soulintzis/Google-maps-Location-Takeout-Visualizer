const fs = require('fs');
const filePath = '../uploads/'
const latitude_center = 38.2466395;
const longitude_center = 21.753150;

retrievedPolygons = [];

let User = require('../models/User');

module.exports = {
    readJsonObjectFromFile: (filename, pass) => {
        path = filePath + filename;
        fs.readFile(path, (err, data) => {
            if(err) throw err;
            let jsonObj = JSON.parse(data);
            objId = pass.user;
            User.findById(objId, function (err, user) { 
                const userId = user.user_id;
            });
            for(item in jsonObj){
                for(subItem in jsonObj[item]){
                    location = jsonObj[item][subItem];
                    var lat = location.latitudeE7/10000000;
                    var lon = location.longitudeE7/10000000;
                    if(module.exports.checkLocation(lat, lon) < 10.0) {

                    }else{
                        continue;
                    }
                }
            }
        });
    },
    readJsonObjectFromFileExtra: (filename, locations, pass) => {
        path = filePath + filename;
        fs.readFile(path, (err, data) => {
            if(err) throw err;
            let jsonObj = JSON.parse(data);
            objId = pass.user;
            User.findById(objId, function (err, user) { 
                const userId = user.user_id;
            });
            for(loc in locations.polygons){
                polygon = [];
                for(point in locations.polygons[loc]){
                    polygon.push(locations.polygons[loc][point].split(','));
                }
                retrievedPolygons.push(polygon);
            }
            for(item in jsonObj){
                for(subItem in jsonObj[item]){
                    location = jsonObj[item][subItem];
                    var lat = location.latitudeE7/10000000;
                    var lon = location.longitudeE7/10000000;
                    var isInsidePolygon = false;
                    for(pol in retrievedPolygons){
                        if(module.exports.checkPolygon(retrievedPolygons[pol], lat, lon)){
                            isInsidePolygon = !isInsidePolygon
                            break;
                        }
                    }
                    if(module.exports.checkLocation(lat, lon) < 10.0 && !isInsidePolygon) {
                        // console.log(lat + ', ' +  lon + ' inside');
                    }else{
                        continue;
                    }
                }
            }
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
        var isInside = false;

        for(var i = 0, j = polygon.length-1; i < polygon.length; j = i++){
            var xi = parseFloat(polygon[i][0]), yi = parseFloat(polygon[i][1]);
            var xj = parseFloat(polygon[j][0]), yj = parseFloat(polygon[j][1]);
            var intersect = ((yi > lon) != (yj > lon))
            && (lat < (xj - xi) * (lon - yi) / (yj - yi) + xi);
            if (intersect) {
                isInside = !isInside;
            }
        }
        return isInside;
    }

};
