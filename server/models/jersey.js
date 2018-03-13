var mongoose = require('mongoose');

var jerseySchema = mongoose.Schema({

	eventId : String,
	userId : String,
	size : String,
	hidden : Boolean,
	paid : Boolean

});

module.exports = mongoose.model('Jersey', jerseySchema);