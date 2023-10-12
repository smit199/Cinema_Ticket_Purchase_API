const express = require('express');
const router = express.Router();
const cinemaController = require('./../controllers/cinemaController');

router.route('/cinema')
.get(cinemaController.getAllCinemas)
.post(cinemaController.createCinema);

router.route('/cinema/:id')
.get(cinemaController.getCinemaById);

router.route('/cinema/:id/availableSeats')
.get(cinemaController.viewAvailableSeats);

module.exports = router;