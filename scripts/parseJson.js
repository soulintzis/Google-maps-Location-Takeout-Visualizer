const fs = require('fs');
const filePath = '../uploads/'
const latitude_center = 38.2466395;
const longitude_center = 21.753150;
var counter = 0;
module.exports = {
    readJsonObjectFromFile: (filename) => {
        path = filePath + filename;
        fs.readFile(path, (err, data) => {
            if(err) throw err;
            let jsonObj = JSON.parse(data);
            for(item in jsonObj){
                for(subItem in jsonObj[item]){
                    location = jsonObj[item][subItem];
                    lat = location.latitudeE7/10000000;
                    lon = location.longitudeE7/10000000;
                    counter = counter + 1;
                    if(module.exports.checkLocation(lat, lon) > 10.0) {
                        console.log(lat, lon + ' outside');
                    }else{
                        console.log(lat, lon + ' inside');
                    }
                }
            }
            console.log(counter);
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
    }
};