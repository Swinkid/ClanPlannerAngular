var mongoose = require('mongoose');

var checklistSchema = mongoose.Schema({

	"eventId" : String,
	"category" : {
		"name" : String,
		"items" : {}
	}

});

module.exports = mongoose.model('Checklist', checklistSchema);