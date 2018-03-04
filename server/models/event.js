var mongoose = require('mongoose');

var eventSchema = mongoose.Schema({

	"name" : String,
	"fromDate" : Date,
	"toDate" : Date,
	"users" : [],
	"competitions" : [],
	"activities" : []

});

module.exports = mongoose.model('Event', eventSchema);