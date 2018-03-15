var mongoose = require('mongoose');

var seatPickerSchema = mongoose.Schema({

	"event" : String,
	"userId" : String,
	"onPicker" : String,
	"actualSeat" : String

});

module.exports = mongoose.model('SeatPicker', seatPickerSchema);