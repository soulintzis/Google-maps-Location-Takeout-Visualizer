const mongoose = require('mongoose');

const leaderBoardSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    eco_score: {
        type: Number,
        required: true
    }
});

const LeaderBoard = mongoose.exports = mongoose.model('LeaderBoard', leaderBoardSchema);
module.exports = LeaderBoard;

