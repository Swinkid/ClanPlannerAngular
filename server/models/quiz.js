var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var quizSchema = mongoose.Schema({

	"tableNumber" : Number,
	"event" : { type: Schema.Types.ObjectId, ref: 'Event' },
	"bookedBy" : { type: Schema.Types.ObjectId, ref: 'User' },
	"paypalLink" : String,
	"tableType" : String,
	"attendees" : [{
		user: { type: Schema.Types.ObjectId, ref: 'User' },
		paid: Boolean
	}]

});

module.exports = mongoose.model('Quiz', quizSchema);