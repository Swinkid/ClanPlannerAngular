var mongoose = require('mongoose');

var userSchema = mongoose.Schema({

	discord            : {},
	regEvents			: [],
	regDate				: Date


});

module.exports = mongoose.model('User', userSchema);