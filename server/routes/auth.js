const express = require('express');
const router = express.Router();
var passport = require('passport');
var jwt = require('jsonwebtoken');

var env = process.env.NODE_ENV || 'development';
var config = require('../../config')[env];

router.get('/discord', passport.authenticate('discord', { scope: config.auth.discord.scopes }));


router.get('/discord/callback', function (req, res, next) {

	passport.authenticate('discord', function (err, user) {

		if(err){
			return next(err);
		}

		if(!user){
			return res.redirect('/');
		}

		var rolesData = [];

		if(user.admin){
			rolesData.push('admin');
		} else {
			rolesData.push('user');
		}

		var tokenData = {
			user: user,
			roles: rolesData
		};

		var token = jwt.sign(tokenData, config.auth.token.secret, { expiresIn: '1h' });

		//TODO: Set cookie secure
		return res.cookie(config.auth.cookie.name, token, { }).redirect('/dashboard');

	})(req, res, next);

});


module.exports = router;