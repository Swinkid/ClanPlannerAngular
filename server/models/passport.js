
var Strategy = require('passport-discord').Strategy;

var env = process.env.NODE_ENV || 'development';
var config = require('../../config')[env];
const User = require('./user');


module.exports = function(passport) {
	passport.use(new Strategy({
		clientID: config.auth.discord.clientID,
		clientSecret: config.auth.discord.clientSecret,
		callbackURL: config.auth.discord.callbackURL,
		scope: config.auth.discord.scopes
	}, function (accessToken, refreshToken, profile, done) {
		process.nextTick(function () {

			User.findOne({"discord.id": profile.id}, function (error, user) {

				if(error){
					console.log(error);
				}

				if(!user){

					var user = new User({
						discord: profile,
						regEvents: [],
						regDate: new Date().getTime(),
						admin: false
					});

					user.save(function (err) {
						if(!err){
							return done(null, user);
						}
					});

				} else {
					//TODO: Update after X time
					return done(null, user);
				}
			});

		});
	}));

	passport.serializeUser(function (user, done) {
		done(null, user);
	});
	passport.deserializeUser(function (obj, done) {
		done(null, obj);
	});
};