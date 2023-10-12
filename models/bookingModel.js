const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
        required: [true, "Provide user id"]
    },
    cinemaId: {
        type: mongoose.Types.ObjectId,
        ref: 'cinemas',
        required: [true, "Provide cinema id"]
    },
    seatNo: {
        type: [Number],
        required: [true, "Provide seat number"]
    },
    booking_date: {
        type: Date,
        default: new Date()
    }
});

const Booking = mongoose.model('bookings', bookingSchema);
module.exports = Booking;