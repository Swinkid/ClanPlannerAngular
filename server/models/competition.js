var mongoose = require('mongoose');

var competitionSchema = mongoose.Schema({

	eventId : String,
	game : String,
	teams : [
		{
			teamName : String,
			mainTeam: [],
			subs : []
		}
	]


});

module.exports = mongoose.model('Competition', competitionSchema);