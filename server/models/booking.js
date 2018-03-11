var mongoose = require('mongoose');

var bookingSchema = mongoose.Schema({

	"event" : String,
	"booking" : {}

});

module.exports = mongoose.model('Booking', bookingSchema);