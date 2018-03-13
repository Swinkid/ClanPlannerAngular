var mongoose = require('mongoose');

var userSchema = mongoose.Schema({

	discord            : {},
	regEvents			: [],
	regDate				: Date,
	admin				: Boolean

});

module.exports = mongoose.model('User', userSchema);