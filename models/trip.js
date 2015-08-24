var mongoose = require('mongoose');

var TripSchema = new mongoose.Schema({
  days:  [{type: mongoose.Schema.Types.ObjectId, ref: 'Day'}],
});

module.exports = mongoose.model('Trip', TripSchema);