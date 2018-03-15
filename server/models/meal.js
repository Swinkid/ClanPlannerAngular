var mongoose = require('mongoose');

var mealSchema = mongoose.Schema({

	"event" : String,
	"drivingNumberOfSeats" : Number,
	"needsLift" : Boolean,
	"dietaryRequirements" : String,
	"passengers" : []

});

module.exports = mongoose.model('Meal', mealSchema);