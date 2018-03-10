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

				//TODO : Need to rework how users are stored in db
				delete req.principal.user.discord.accessToken;
				delete req.principal.user.discord.email;
				delete req.principal.user.discord.fetchedAt;

				var attendance = new Attendance({

					userId : req.principal.user._id,
					eventId : filteredId,
					discord : req.principal.user.discord,
					realName: "",
					broughtTicket: false,
					onSeatPicker: false,
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

router.post('/events/attendance/:event', authenticate, function (req, res) {

	//TODO XSS and validate

	var attendance = new Attendance({

		userId : req.principal.user._id,
		eventId : xss(req.params.event),
		discord : req.principal.user.discord,
		realName:  xss(req.body.formValue.realName),
		broughtTicket:  xss(req.body.formValue.ticketPurchasedSelect),
		onSeatPicker:  xss(req.body.formValue.seatPickerSelect),
		accommodation:  xss(req.body.formValue.accommodationSelect),
		transportPlans:  xss(req.body.formValue.transportSelect),
		dateArriving: new Date(xss(req.body.formValue.arrivalDate)),
		location:  xss(req.body.formValue.location),
		inFacebookChat:  xss(req.body.formValue.inFacebookChat)

	});

	Event.update({'_id': req.params.event}, { $pull: { 'users': {'userId': req.principal.user._id}}}, function (error, updatedEvent) {
		if(error){
			return res.status(500).json({error: 'Internal Server Error'});
		}

		if(!updatedEvent){
			return res.status(204).json({error: 'Event not found'});
		}

		if(updatedEvent){

			Event.update({'_id': req.params.event}, { $push: { 'users': attendance}}, function (error, addedAttendance) {
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

});

router.post('/events', authenticate, function (req, res) {

	var filteredName = xss(req.body.formValue.name);
	var filteredFromDate = xss(req.body.formValue.fromDate);
	var filteredToDate = xss(req.body.formValue.toDate);
	var filteredSeatPickerUrl = xss(req.body.formValue.seatPickerUrl);
	var filteredEventLocation = xss(req.body.formValue.eventLocation);

	var newEvent = new Event({
		name: filteredName,
		fromDate: filteredFromDate,
		toDate: filteredToDate,
		seatPickerUrl: filteredSeatPickerUrl,
		eventLocation: filteredEventLocation
	});

	newEvent.save(function (error, event) {
		if(error){
			return res.status(500).json({error: 'Internal Server Error'});
		}

		if(!event){
			return res.status(500).json({error: 'Internal Server Error'});
		}

		if(event){
			return res.status(200).json({error: 'Done'});
		}
	});

});

router.post('/events/:id', authenticate, function (req, res) {

	var filteredEventId = xss(req.params.id);
	var filteredName = xss(req.body.formValue.name);
	var filteredFromDate = xss(req.body.formValue.fromDate);
	var filteredToDate = xss(req.body.formValue.toDate);
	var filteredSeatPickerUrl = xss(req.body.formValue.seatPickerUrl);
	var filteredEventLocation = xss(req.body.formValue.eventLocation);

	Event.update({_id: filteredEventId}, {$set: { name: filteredName, fromDate: filteredFromDate, toDate: filteredToDate, seatPickerUrl: filteredSeatPickerUrl, eventLocation: filteredEventLocation }}, function (error) {

		if(error){

			return res.status(500).json({error: 'Internal Server Error'});

		} else {

			return res.status(200).json({error: 'Done'});

		}
	});

});

router.delete('/events/:id', authenticate, function (req, res) {

	Event.remove({_id: xss(req.params.id)}, function (error) {
		if(error){
			return res.status(500).json({error: 'Internal Server Error'});
		} else {
			return res.status(200).json({error: 'Done'});
		}
	})

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