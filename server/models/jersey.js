var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var jerseySchema = mongoose.Schema({

	user : { type: Schema.Types.ObjectId, ref: 'User' },
	event : { type: Schema.Types.ObjectId, ref: 'Event' },
	size : String,
	hidden : Boolean,
	paid : Boolean

});

module.exports = mongoose.model('Jersey', jerseySchema);