var express = require('express');
var router = express.Router();
var models = require('../models');
var Hotel = models.Hotel;
var Restaurant = models.Restaurant;
var Activity = models.Activity;
var Trip = models.Trip;
var Promise = require('bluebird');

router.use('/api/days/',require('./api/days'));

router.get('/', function(req, res) {
  Promise.all([
    Hotel.find(),
    Restaurant.find(),
    Activity.find(),
    Trip.findOne().populate('days'),
    ]).spread(function(hotels, restaurants, activities,trip) {
      res.render('index', {
        all_hotels: hotels,
        all_restaurants: restaurants,
        all_activities: activities,
        trip: trip
      });
    });
});

module.exports = router;
