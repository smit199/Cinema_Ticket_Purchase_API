const mongoose = require('mongoose');

const cinemaSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Provide cinema name"],
    },
    totalSeats: {
        type: Number,
        required: [true, "Provide total number of seats"]
    },
}, {
    timestamp: true,
    versionKey: false
});

cinemaSchema.index({
    'name': "text"
});

const Cinema = mongoose.model('cinemas', cinemaSchema);
Cinema.syncIndexes();

module.exports = Cinema;