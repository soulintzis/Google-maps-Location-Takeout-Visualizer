const fs = require('fs');
const filePath = '../uploads/'
module.exports = {
    readJsonObjectFromFile: (filename) => {
        path = filePath + filename;
        fs.readFile(path, (err, data) => {
            if(err) throw err;
            let jsonObj = JSON.parse(data);
            for(item in jsonObj){
                for(subItem in jsonObj[item]){
                    location = jsonObj[item][subItem];
                    console.log(location);
                }
            }
        });
    }
};