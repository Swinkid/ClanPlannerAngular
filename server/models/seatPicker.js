var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var seatPickerSchema = mongoose.Schema({

	"event" : { type: Schema.Types.ObjectId, ref: 'Event' },
	"user" : { type: Schema.Types.ObjectId, ref: 'User' },
	"onPicker" : String,
	"actualSeat" : String,
	"notes" : String

});

module.exports = mongoose.model('SeatPicker', seatPickerSchema);