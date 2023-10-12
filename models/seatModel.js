const mongoose = require('mongoose');

const seatSchema = mongoose.Schema({
    seatNo: {
        type: Number,
        required: [true, "Provide seat number"],
    },
    cinemaId: {
        type: mongoose.Types.ObjectId,
        ref: 'cinemas',
        required: [true, "Provide cinema id"]
    },
    bookedBy: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
        default: null
    }
});

const Seat = mongoose.model('seats', seatSchema);
module.exports = Seat;