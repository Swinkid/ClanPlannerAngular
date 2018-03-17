var mongoose = require('mongoose');

var userSchema = mongoose.Schema({

	discord            : {},
	regEvents			: [],
	regDate				: Date,
	admin				: Boolean,
	realName			: String,
	nickname			: String

});

module.exports = mongoose.model('User', userSchema);