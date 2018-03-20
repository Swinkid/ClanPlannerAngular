var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookingSchema = mongoose.Schema({

	"event" : { type: Schema.Types.ObjectId, ref: 'Event' },
	"booking" : {
		"bookedBy" : { type: Schema.Types.ObjectId, ref: 'User' },
		"totalCost" : Number,
		"roomType" : String,
		"rooms" : [
			{
				"roomOccupants" : [{ type: Schema.Types.Object, ref: 'User' }],
			}
		]
	}

});

module.exports = mongoose.model('Booking', bookingSchema);