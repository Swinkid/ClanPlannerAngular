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
	"hotelAddress" : String,
	"hotelNumber" :String,
	"hotelName" : String,
	"jerseySizeChart" : String,
	"jerseyPaymentLink" : String,
	"jerseyDesignLink" : String,
	"mealAddress" : String,
	"mealName" : String,
	"mealTime" : String,
	"mealDate" : Date,
	"showJersey" : { type: Boolean, default: false},
	"showQuiz" : { type: Boolean, default: false},
	"showComps" : { type: Boolean, default: false},
	"showSeating" : { type: Boolean, default: false},
	"showMeal" : { type: Boolean, default: false}
});

module.exports = mongoose.model('Event', eventSchema);