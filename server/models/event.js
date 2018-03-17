var mongoose = require('mongoose');

var eventSchema = mongoose.Schema({

	"name" : String,
	"fromDate" : Date,
	"toDate" : Date,
	"seatPickerUrl" : String,
	"eventLocation" : String

});

module.exports = mongoose.model('Event', eventSchema);