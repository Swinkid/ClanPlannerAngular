const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

var env = process.env.NODE_ENV || 'development';
var config = require('../../config')[env];

const Event = require('../models/event');

/* GET api listing. */
router.get('/', function (req, res) {
	res.send('api works');
});

router.get('/register', middleware, function (req, res) {

	Event.find({}, function (error, events) {

		if(error){
			return res.status(500).json({error: 'Internal Server Error'});
		}

		return res.status(200).json(events);
	});

});

function middleware(req, res, next) {
	var token = req.headers['x-access-token'];

	if(token){

		try {

			var decoded = jwt.verify(token, config.auth.token.secret);

			req.principal = {
				isAuthenticated: true,
				roles: decoded.roles || [],
				user: decoded.user
			};

			return next();

		} catch (error) {

			return res.status(500).json({error: 'Internal Server Error'});

		}

	}

	return res.status(401).json({error: 'Invalid Access Token'});
}

module.exports = router;