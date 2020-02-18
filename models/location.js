const mongoose = require('mongoose');

const locationSchema = mongoose.Schema({
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
            type: Date,
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
    ],
    user_id: {
        type: String,
        required: true
    }
});

const Location = mongoose.exports = mongoose.model('Location', locationSchema);
module.exports = Location;

