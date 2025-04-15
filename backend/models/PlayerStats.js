const mongoose = require('mongoose');

const playerStatsSchema = new mongoose.Schema({
    playerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    matches: {
        type: Number,
        default: 0
    },
    runs: {
        type: Number,
        default: 0
    },
    wickets: {
        type: Number,
        default: 0
    },
    average: {
        type: Number,
        default: 0
    },
    strikeRate: {
        type: Number,
        default: 0
    },
    fifties: {
        type: Number,
        default: 0
    },
    hundreds: {
        type: Number,
        default: 0
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('PlayerStats', playerStatsSchema);