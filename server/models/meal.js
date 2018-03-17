var mongoose = require('mongoose');

var mealSchema = mongoose.Schema({

	"event" : { type: Schema.Types.ObjectId, ref: 'Event' },
	"user" : { type: Schema.Types.ObjectId, ref: 'User' },
	"drivingNumberOfSeats" : Number,
	"needsLift" : Boolean,
	"dietaryRequirements" : String,
	"passengers" : [{ type: Schema.Types.ObjectId, ref: 'User' }]

});

module.exports = mongoose.model('Meal', mealSchema);