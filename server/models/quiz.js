var mongoose = require('mongoose');

var quizSchema = mongoose.Schema({

	"event" : String,
	"bookedBy" : String,
	"paypalLink" : String,
	"tableType" : String,
	"attendees" : []

});

module.exports = mongoose.model('Quiz', quizSchema);