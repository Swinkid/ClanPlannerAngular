const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
var xss = require("xss");

var env = process.env.NODE_ENV || 'development';
var config = require('../../config')[env];

const Event = require('../models/event');
const User = require('../models/user');

/* GET api listing. */
router.get('/', function (req, res) {
	res.send('api works');
});

router.get('/users', authenticate, function (req, res) {

	//TODO: Joi to validate

	var filteredId = xss(req.query.id);
	var users = filteredId.split(",");

	var query;
	if(req.query.id){
		query = {_id: users};
	} else {
		query = {};
	}

	User.find(query, function (error, user) {

		if(error){
			return res.status(500).json({error: 'Internal Server Error'});
		}

		if(!user){
			return res.status(204).json({error: 'User not found'});
		}

		return res.status(200).json(user);
	});

});

router.get('/users/:id', authenticate, function (req, res) {

	//TODO: Joi to validate

	var filteredId = xss(req.params.id);

	User.findOne({_id: filteredId}, function (error, user) {

		if(error){
			return res.status(500).json({error: 'Internal Server Error'});
		}

		if(!user){
			return res.status(204).json({error: 'User not found'});
		}

		return res.status(200).json(user);
	});

});

router.patch('/users/:id', authenticate, function (req, res) {

    return res.status(501).json({error: "Not Implemented"});

});

router.delete('/users/:id', authenticate, function (req, res) {

    return res.status(501).json({error: "Not Implemented"});

});

router.get('/events', authenticate, function (req, res) {

	//TODO: Joi to validate
	//TODO: XSS validate?

	Event.find({}, function (error, events) {

		if(error){
			return res.status(500).json({error: 'Internal Server Error'});
		}

		return res.status(200).json(events);
	});

});

router.get('/events/:id', authenticate, function (req, res) {

    return res.status(501).json({error: "Not Implemented"});

});

router.post('/events', authenticate, function (req, res) {

    return res.status(501).json({error: "Not Implemented"});

});

router.patch('/events/:id', authenticate, function (req, res) {

    return res.status(501).json({error: "Not Implemented"});

});

router.delete('/events/:id', authenticate, function (req, res) {

    return res.status(501).json({error: "Not Implemented"});

});

router.get('/activities/:id', authenticate, function (req, res) {

    return res.status(501).json({error: "Not Implemented"});

});

router.get('/activities', authenticate, function (req, res) {

    return res.status(501).json({error: "Not Implemented"});

});

router.post('/activities', authenticate, function (req, res) {

    return res.status(501).json({error: "Not Implemented"});

});

router.patch('/activities/:id', authenticate, function (req, res) {

    return res.status(501).json({error: "Not Implemented"});

});

router.delete('/activities/:id', authenticate, function (req, res) {

    return res.status(501).json({error: "Not Implemented"});

});

router.get('/activities/type', authenticate, function (req, res) {

    return res.status(501).json({error: "Not Implemented"});

});

router.get('/activities/type/:id', authenticate, function (req, res) {

    return res.status(501).json({error: "Not Implemented"});

});

router.post('/activities/type', authenticate, function (req, res) {

    return res.status(501).json({error: "Not Implemented"});

});

router.get('/activities/type/:id', authenticate, function (req, res) {

    return res.status(501).json({error: "Not Implemented"});

});

router.patch('/activities/type/:id', authenticate, function (req, res) {

    return res.status(501).json({error: "Not Implemented"});

});

router.delete('/activities/type/:id', authenticate, function (req, res) {

    return res.status(501).json({error: "Not Implemented"});

});

function authenticate(req, res, next) {
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