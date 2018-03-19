var mongoose = require('mongoose');

var eventSchema = mongoose.Schema({

	"name" : String,
	"fromDate" : Date,
	"toDate" : Date,
	"eventLocation" : String,
	"eventUrl" : String,
	"seatPickerUrl" : String,
	"clanTracker" : String,
	"clanPage" : String,
	"chatLink" : String,
	"hotelCheckin" : Date,
	"hotelCheckinTime": String,
	"hotelCheckout" : Date,
	"hotelCheckoutTime" : String,
	"hotelAddres" : String,
	"hotelNumber" :String,
	"hotelName" : String,
	"jerseySizeChart" : String,
	"jerseyPaymentLink" : String,
	"jerseyDesignLink" : String,
	"mealAddress" : String,
	"mealName" : String,
	"mealTime" : String,
	"mealDate" : Date,
	"showJersey" : Boolean,
	"showQuiz" : Boolean,
	"showComps" : Boolean,
	"showSeating" : Boolean,
	"showMeal" : Boolean
});

module.exports = mongoose.model('Event', eventSchema);