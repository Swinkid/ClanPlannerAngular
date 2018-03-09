var mongoose = require('mongoose');

var attendanceSchema = mongoose.Schema({

	userId : String,
	eventId : String,
	discord : {},
	realName: String,
	broughtTicket: Boolean,
	onSeatPicker: Boolean,
	dateArriving: Date,
	accommodation: String,
	transportPlans: String,
	location: String,
	inFacebookChat: Boolean

});

module.exports = mongoose.model('Attendance', attendanceSchema);