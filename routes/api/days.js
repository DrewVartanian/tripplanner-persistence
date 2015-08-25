var express = require('express');
var router = express.Router();
var models = require('../../models');
var Trip = models.Trip;
var Hotel = models.Hotel;
var Day = models.Day;
var Restaurant = models.Restaurant;
var Activity = models.Activity;
var Promise = require('bluebird');
var mongoose = require('mongoose');

router.get('/', function(req,res,next) {
  Day.find().exec().then(function(days){
    res.json(days);
  }).catch(next);
});

router.get('/trip',function(req,res,next){
  var resObj = {};
  Trip.findOne({}).exec().then(function(trip){
    resObj.days=trip.days;
    Day.findById(resObj.days[0]).populate('hotels').populate('restaurants').
      populate('activities').exec().then(function(day){
        resObj.hotels = day.hotels;
        resObj.restaurants = day.restaurants;
        resObj.activities = day.activities;
        res.json(resObj);
      });
  });
});

router.post('/create',function(req,res,next){
  Day.create({}).then(function(day){
    Trip.findOne({}).exec().then(function(trip){
      trip = trip || new Trip({days: []});
      trip.days.push(day._id);
      trip.save().then(function(){
        res.send();
      });
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

router.get('/:id',function(req,res,next){
  res.json(req.day);
});

router.delete('/:id',function(req,res,next){
  if(req.day){

    Trip.findOne().exec().then(function(trip){
      var i;
      trip.days.some(function(tripDay,index){
        if(tripDay.toString()===req.day._id.toString()){
          i = index;
          return true;
        }
      });
      trip.days=trip.days.slice(0,i).concat(trip.days.slice(i+1));
      return trip.save();
    }).then(function(){
      req.day.remove();
      res.send();
    }).catch(next);
  }else{
    return next(new Error("day not found"));
  }
});

router.param('toDo', function(req,res,next,toDo){
  if(toDo !== 'hotels' && toDo !=='restaurants' && toDo !== 'activities'){
    return next(new Error('Bad Activity'));
  }
  req.toDo = toDo;
  next();
});

router.get('/:id/:toDo',function(req,res,next){
  req.day.populate(req.toDo).execPopulate().then(function(day){
    res.json(day[req.toDo]);
  }).catch(next);
});

router.post('/:id/:toDo',function(req,res,next){
  var day = req.day;
  var toDo = req.toDo;
  day[toDo].push(mongoose.Types.ObjectId(req.body.value));
  day.save().then(function(){
    res.send();
  }).catch(next);
});

router.delete('/:id/:toDo',function(req,res,next){
  var day = req.day;
  var toDo = req.toDo;
  var i;
  day[toDo].some(function(id,index){
    if(id.toString()===req.body.value){
      i=index;
      return true;
    }
  });
  day[toDo]=day[toDo].slice(0,i).concat(day[toDo].slice(i+1));
  day.save().then(function(){
    res.send();
  }).catch(next);
});


router.use(function(req,res,next,error){
  console.log("error!!");
  console.log(error);
  next(error);
});

module.exports = router;