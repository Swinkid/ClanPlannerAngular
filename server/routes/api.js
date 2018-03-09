const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const xss = require("xss");
const _ = require('lodash');

var env = process.env.NODE_ENV || 'development';
var config = require('../../config')[env];

const Event = require('../models/event');
const User = require('../models/user');
const Attendance = require('../models/attendance');

/* GET api listing. */
router.get('/', function (req, res) {
	res.send('api works');
});

//TODO: Split endpoints?

router.get('/users', function (req, res) {

	//TODO: Joi to validate

	var filteredId = xss(req.query.id);
	var users = filteredId.split(",");

	var query;
	if(req.query.id){
		query = {_id: users};
	} else {
		query = {};
	}

	if(filteredId == ""){

		return res.status(200).json([]);

	} else {
		User.find(query, function (error, user) {

			if(error){
				return res.status(500).json({error: 'Internal Server Error'});
			}

			if(!user){
				return res.status(204).json({error: 'User not found'});
			}

			return res.status(200).json(user);
		});
	}

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

	var filteredId = xss(req.query.id);
	var events = filteredId.split(",");

	var query;
	if(req.query.id){
		query = {_id: events};
	} else {
		query = {};
	}


	Event.find(query, function (error, events) {

		if(error){
			return res.status(500).json({error: 'Internal Server Error'});
		}

		return res.status(200).json(events);
	});

});

router.get('/events/:id', authenticate, function (req, res) {

	var filteredId = xss(req.params.id);

	Event.findOne({_id: filteredId}, function (error, user) {

		if(error){
			return res.status(500).json({error: 'Internal Server Error'});
		}

		if(!user){
			return res.status(204).json({error: 'Event not found'});
		}

		return res.status(200).json(user);
	});

});



	//TODO: In hindsight, this is a jankey way of doing it.......
	//http://mongoosejs.com/docs/subdocs.html#altsyntax
	//Leverage above instead


router.post('/events/register/:id', authenticate, function (req, res) {

	var filteredId = xss(req.params.id);
	var filteredToggle = xss(req.body.attendance);


	if(filteredToggle === "true"){

		Event.findOne({'_id': filteredId}, function (error, fetchedEvent) {

			if(error){
				return res.status(500).json({error: 'Internal Server Error'});
			}

			if(!fetchedEvent){
				return res.status(204).json({error: 'Event not found'});
			}

			if(fetchedEvent.users.indexOf(req.principal.user._id) > -1){
				return res.status(204).json({error: 'User already attending'});
			} else {

				var attendance = new Attendance({

					userId : req.principal.user._id,
					eventId : filteredId,
					discord : req.principal.user.discord,
					realName: "",
					broughtTicket: false,
					onSeatPicker: false,
					dateArriving: new Date(0),
					accommodation: "",
					transportPlans: "",
					location: "",
					inFacebookChat: false

				});

				Event.update({'_id': filteredId}, { $push: { 'users': attendance}}, function (error, updatedEvent) {
					if(error){
						return res.status(500).json({error: 'Internal Server Error'});
					}

					if(!updatedEvent){
						return res.status(204).json({error: 'Event not found'});
					}

					if(updatedEvent){
						return res.status(200).json({error: 'Done'});
					}
				});

			}

		});

	}

	if(filteredToggle === "false"){

		Event.update({'_id': filteredId}, { $pull: { 'users': {'userId': req.principal.user._id}}}, function (error, updatedEvent) {
			if(error){
				return res.status(500).json({error: 'Internal Server Error'});
			}

			if(!updatedEvent){
				return res.status(204).json({error: 'Event not found'});
			}

			if(updatedEvent){
				return res.status(200).json({error: 'Done'});
			}
		});

	}

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