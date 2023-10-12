const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authController');
const bookingsController = require('./../controllers/bookingsController');

router.route('/cinema/signup')
.post(authController.signupUser);

router.route('/cinema/login')
.post(authController.loginUser);

router.use(authController.authenticate);

// To book one seat in cinema
router.route('/cinema/:cinemaId/bookSeat/:seatNo')
.post(bookingsController.bookOneSeat);

// To book N number of consecutive seats available in cinema
router.route('/cinema/:cinemaId/bookConsecutiveSeats/:totalBookingSeats')
.post(bookingsController.bookConsecutiveSeats);

module.exports = router;