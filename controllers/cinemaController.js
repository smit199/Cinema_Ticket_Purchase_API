const AppError = require('../utils/appError');
const cinemaModel = require('../models/cinemaModel');
const seatModel = require('../models/seatModel')
const { catchAsyncErrors } = require('./errorController');
const APIFeatures = require('../utils/apiFeatures');

exports.getAllCinemas = catchAsyncErrors(async (req, res, next) => {
    const features = new APIFeatures(cinemaModel.find(), req.query);
    const cinemas = await features.search().sort().paginate().query;
    res.status(200).json({
        status: 'success',
        message: null,
        data: {
            cinemas,
        }
    });
});

exports.getCinemaById = catchAsyncErrors(async (req, res, next) => {
    const cinema = await cinemaModel.findById(req.params.id);
    if(!cinema)   throw new AppError('Cinema with given id does not exist', 404);
    
    // Counting number of available and booked seats
    const availableSeatsCount = await seatModel.countDocuments({
        cinemaId: req.params.id,
        bookedBy: null
    });
    const bookedSeatsCount = cinema.totalSeats - availableSeatsCount;

    res.status(200).json({
        status: 'success',
        message: null,
        data: {
            cinema,
            availableSeatsCount,
            bookedSeatsCount
        }
    });
});

exports.createCinema = catchAsyncErrors(async (req, res, next) => {
    const newCinema = await cinemaModel.create(req.body);
    for(let i=1; i<=newCinema.totalSeats; i++) {
        await seatModel.create({seatNo: i, cinemaId: newCinema._id});
    }
    res.status(201).json({
        status: 'success',
        message: 'New cinema is created successfully',
        data: {
            cinemaId: newCinema._id,
        }
    });
});

exports.viewAvailableSeats = catchAsyncErrors(async (req, res, next) => {
    if(!await cinemaModel.findById(req.params.id))  throw new AppError('Cinema with given id does not exist', 404);
    const filter = {
        cinemaId: req.params.id,
        bookedBy: null
    }

    // returning all available seat numbers
    const seats = await seatModel.find(filter);
    const availableSeats = [];
    seats.forEach(seat => availableSeats.push(seat.seatNo));
    
    res.status(200).json({
        status: 'success',
        message: null,
        data: {
            availableSeats
        }
    });
});