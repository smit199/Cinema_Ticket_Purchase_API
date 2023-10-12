const AppError = require('../utils/appError');
const seatModel = require('../models/seatModel');
const bookingModel = require('../models/bookingModel');
const cinemaModel = require('../models/cinemaModel');
const { catchAsyncErrors } = require('./errorController');
const APIFeatures = require('../utils/apiFeatures');

exports.bookOneSeat = catchAsyncErrors(async (req, res, next) => {
    const cinemaId = req.params.cinemaId;
    const seatNo = +req.params.seatNo;

    const cinema = await cinemaModel.findById(cinemaId);
    if(!cinema)  throw new AppError('Cinema with given id does not exist', 404);
    if(seatNo > cinema.totalSeats)  throw new AppError(`Enter valid seat number. Max seat no. is ${cinema.totalSeats}`, 404);

    // Updating booking seat detail
    const filter = {
        seatNo,
        cinemaId,
        bookedBy: null
    }
    const update = {
        bookedBy: req.user._id,
    }
    const seat = await seatModel.findOneAndUpdate(filter, update, {new: true});
    if(!seat)   throw new AppError('Seat is already booked. Try with another seat', 404);

    // creating new booking
    const body = {
        userId: req.user._id,
        cinemaId: seat.cinemaId,
        seatNo: [seat.seatNo]
    }
    const booking = await bookingModel.create(body);

    res.status(200).json({
        status: 'success',
        message: 'Seat is successfully booked',
        data: {
            booking
        }
    });
});

exports.bookConsecutiveSeats = catchAsyncErrors(async (req, res, next) => {
    const cinemaId = req.params.cinemaId;
    const totalBookingSeats = +req.params.totalBookingSeats;

    const cinema = await cinemaModel.findById(cinemaId);
    if(!cinema)  throw new AppError('Cinema with given id does not exist', 404);

    // finding available seats for booking in cinema
    const filter1 = {
        cinemaId: req.params.cinemaId,
        bookedBy: null
    }
    const seats = await seatModel.find(filter1);
    const availableSeats = [];
    seats.forEach(seat => availableSeats.push(seat.seatNo));

    let bookingSeats = [];
    let n=0;

    // calculating n consecutive available seats in cinema
    for(let i=0; i<availableSeats.length-1; i++) {
        if(n === totalBookingSeats) break;
        if(n==0) {
            bookingSeats.push(availableSeats[i]);
            n++;
        }
        if(availableSeats[i+1] - availableSeats[i] === 1) {
            bookingSeats.push(availableSeats[i+1]);
            n++;
        }
        else {
            bookingSeats = [];
            n=0;
        }
    }
    if(n!==totalBookingSeats)  throw new AppError(`${totalSeats} consecutive seats are not available`, 404);

    // updating all available n consecutive seats detail
    const filter2 = {
        seatNo: {$in: bookingSeats},
        cinemaId: req.params.cinemaId,
    }
    const update = {
        bookedBy: req.user._id,
    }
    await seatModel.updateMany(filter2, update);

    // creating new booking
    const body = {
        userId: req.user._id,
        cinemaId: req.params.cinemaId,
        seatNo: bookingSeats
    }
    const booking = await bookingModel.create(body);

    res.status(200).json({
        status: 'success',
        message: 'Seats are successfully booked',
        data: {
            bookedSeats: bookingSeats,
            booking
        }
    });
});