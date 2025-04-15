const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    teamA: {
        type: String,
        required: true
    },
    teamB: {
        type: String,
        required: true
    },
    matchDate: {
        type: Date,
        required: true
    },
    matchTime: {
        type: String,
        required: true
    },
    venue: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Match', matchSchema);