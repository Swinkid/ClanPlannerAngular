var mongoose = require('mongoose');

var userSchema = mongoose.Schema({

	discord            : {},
	regDate				: Date,
	admin				: Boolean,
	realName			: {
		type: String,
		default: ''
	},
	nickname			: {
		type: String,
		default: ''
	}

});

module.exports = mongoose.model('User', userSchema);