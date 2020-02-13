const mongoose = require('mongoose');

const locationSchema = mongoose.Schema({
    user_id : {
        type: String,
        required: false
    },
    timestampMs : {
        type: Date,
        required: true
    },
    latitudeE7 : {
        type: Number,
        required: true
    },
    longitudeE7 : {
        type: Number,
        required: true
    },
    accuracy : {
        type: Number,
        required: true
    },
    altitude : {
        type: Number,
        required: false
    },
    verticalAccuracy : {
        type: Number,
        required: false
    },
    activity : [ new mongoose.Schema({
        timestampMs : {
            type: Number,
            required: true
        },
        activity : [ new mongoose.Schema({
            type: {
                type: String,
                required: true
            },
            confidence: {
                type: Number,
                required: true
            }
        },{
            strict: false
        })
        ]
    }, {    
        strict: false
    },{
        ordered: false
    })
    ]
});

const Location = mongoose.exports = mongoose.model('Location', locationSchema);
module.exports = Location;

