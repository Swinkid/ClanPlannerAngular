var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var attendanceSchema = mongoose.Schema({

	user : { type: Schema.Types.ObjectId, ref: 'User' },
	event : { type: Schema.Types.ObjectId, ref: 'Event' },
	broughtTicket: {
		type: Boolean,
		default: false
	},
	onSeatPicker: {
		type: Boolean,
		default: false
	},
	dateArriving: Date,
	accommodation: String,
	transportPlans: String,
	location: String,
	inFacebookChat: {
		type: Boolean,
		default: false
	}

});

module.exports = mongoose.model('Attendance', attendanceSchema);