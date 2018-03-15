var mongoose = require('mongoose');

var quizSchema = mongoose.Schema({

	"tableNumber" : Number,
	"event" : String,
	"bookedBy" : String,
	"paypalLink" : String,
	"tableType" : String,
	"attendees" : [{
		user: String,
		paid: Boolean
	}]

});

module.exports = mongoose.model('Quiz', quizSchema);