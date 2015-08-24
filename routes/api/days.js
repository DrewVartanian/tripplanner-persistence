var express = require('express');
var router = express.Router();
var models = require('../../models');
var Trip = models.Trip;
var Hotel = models.Hotel;
var Day = models.Day;
var Restaurant = models.Restaurant;
var Activity = models.Activity;
var Promise = require('bluebird');

router.get('/', function(req,res,next) {
  Day.find().exec().then(function(days){
    res.json(days);
  }).catch(next);
});

router.post('/create',function(req,res){
  Day.create({}).then(function(day){
    Trip.findOne({}).exec().then(function(trip){
      trip = trip || new Trip({days: []});
      trip.days.push(day._id);
      trip.save().then(res.send);
    }).catch(next);
  });
});

router.param('id', function(req,res,next,id){
  Day.findById(id,function(err, day){
    if (err) return next(err);
    if(!day) return next(new Error("Day not found"));
    req.day = day;
    return next();
  });
});

router.get('/:id',function(req,res){
  res.json(req.day);
});

router.delete('/:id',function(day,res){
  if(day){
    Trip.findOne().exec().then(function(trip){
      var i;
      trip.days.some(function(tripDay,index){
        if(tripDay._id===day._id){
          i = index;
          return true;
        }
      });
      trip.days=trip.days.slice(0,i).concat(trip.days.slice(i+1));
      trip.save();
    }).then(function(){
      day.remove();
    }).catch(next);
  }else{
    return next(new Error("day not found"));
  }
});


router.use(function(req,res,next,error){
  console.log("error!!");
  console.log(error);
  next(error);
});

module.exports = router;