var mongoose = require('mongoose');

var attendanceSchema = mongoose.Schema({

	userId : String,
	eventId : String,
	discord : {},
	realName: String,
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