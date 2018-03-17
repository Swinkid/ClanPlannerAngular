var mongoose = require('mongoose');

var competitionSchema = mongoose.Schema({

	event : { type: Schema.Types.ObjectId, ref: 'Event' },
	game : String,
	teamName : String,
	mainTeam: [{type: Schema.Types.ObjectId, ref: 'User' }],
	subs : [{type: Schema.Types.ObjectId, ref: 'User' }]

});

module.exports = mongoose.model('Competition', competitionSchema);