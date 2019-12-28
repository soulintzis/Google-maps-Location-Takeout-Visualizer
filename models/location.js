const mongoose = require('mongoose');

const locationSchema = mongoose.Schema({
    timestampMs : {
        type: Number,
        required: true
    },
    latitude : {
        type: Number,
        required: true
    },
    longitude : {
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
    })
    ]
});

const Location = mongoose.exports = mongoose.model('Location', locationSchema);
module.exports = User;

