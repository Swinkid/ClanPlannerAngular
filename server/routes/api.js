const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const xss = require("xss");
const _ = require('lodash');
const mongoose = require('mongoose');

var env = process.env.NODE_ENV || 'development';
var config = require('../../config')[env];

const Event = require('../models/event');
const User = require('../models/user');
const Attendance = require('../models/attendance');
const Booking = require('../models/booking');
const Jersey = require('../models/jersey');
const Quiz = require('../models/quiz');

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

/**
 * Update user details
 */
router.post('/user/:id', authenticate, function (req, res) {

	if((req.params.id === req.principal.user._id) || isAdmin()){

		User.update({_id: req.params.id}, { $set: { realName: xss(req.body.realName), nickname: xss(req.body.nickname)}}, function (error) {
			if(error){
				return res.status(500).json({response: 'Internal Server Error'});
			}

			if(!error){
				res.status(200).json({response: 'Ok'});
			}
		});

	} else {
		return res.status(401).json({error: 'Invalid Access Token'});
	}

});

router.delete('/users/:id', authenticate, isAdmin, function (req, res) {

	return res.status(501).json({error: "Not Implemented"});

});

router.get('/user/:id', authenticate, function (req, res) {

	User.findOne({_id: xss(req.params.id)}, function (error, user) {

		if(error){
			return res.status(500).json({error: 'Internal Server Error'});
		}

		if(!user){
			return res.status(204).json({error: 'User not found'});

		}

		if(user) {
			var returnUser = user;

			delete returnUser.discord.accessToken;
			delete returnUser.discord.fetchedAt;
			delete returnUser.discord.email;

			return res.status(200).json(returnUser);
		}

	});


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


/**
 * Get all attendance for user.
 */
router.get('/attendance/all/:user', authenticate, function (req, res) {

	Attendance.find({user: req.params.user}).populate(['user', 'event']).exec(function (error, result) {

		if(error){
			return res.status(500).json({response: 'Internal Server Error'});
		}

		if(!result){
			return res.status(404).json({response: 'No found attendances'});
		}

		if(result){
			//TODO Really need to remove access tokens and email

			result.forEach(function (r) {
				delete r.user.discord.email;
				delete r.user.discord.accessToken;
			});

			return res.status(200).json(result);
		}

	});

});

/**
 * Get attendance for specified user
 */
router.get('/attendee/:user/:event', authenticate, function (req, res) {

	Attendance.findOne({user: req.params.user, event:req.params.event}, function (error, foundAttendance) {

		if(error){
			return res.status(500).json({response: 'Internal Server Error'});
		}

		if(!foundAttendance){
			return res.status(404).json({response: 'No found attendances'});
		}

		if(foundAttendance){
			return res.status(200).json(foundAttendance);
		}


	});

});

/**
 * Update (user) registration details
 */
router.post('/attendance/:user/:event', authenticate, function (req, res) {

	if(req.params.user === req.principal.user._id || isAdmin()){

		Attendance.update({user: xss(req.params.user), event: xss(req.params.event)}, {
			$set : {
				broughtTicket:  req.body.ticketPurchasedSelect,
				onSeatPicker:  req.body.seatPickerSelect,
				accommodation:  xss(req.body.accommodationSelect),
				transportPlans:  xss(req.body.transportSelect),
				dateArriving: new Date(xss(req.body.arrivalDate)),
				location:  xss(req.body.location),
				inFacebookChat:  req.body.inFacebookChat
			}
		}, function (error) {
			if(error){
				return res.status(500).json({response: 'Internal Server Error'});
			}

			if(!error){
				res.status(200).json({response: 'Ok'});
			}
		});

	} else {

		return res.status(401).json({error: 'Invalid Access Token'});

	}

});

router.get('/attendance/:event', function (req, res) {

	Attendance.find({event: req.params.event}).populate('user').exec(function (error, attendance) {

		if(error){
			return res.status(500).json({response: 'Internal Server Error'});
		}

		if(!attendance){
			return res.status(404).json({response: 'No found attendances'});
		}

		if(attendance){
			attendance.forEach(function (a) {

				delete a.user.discord.email;
				delete a.user.discord.accessToken;

			});

			res.status(200).json(attendance);
		}

	});

});

/**
 * Register (user) for event
 */
router.post('/attendee/register/:event', authenticate, function (req, res) {

	if(req.body.attendance === true){

		Attendance.findOne({user: req.principal.user._id, event: xss(req.params.event)}, function (error, foundAttendance) {

			if(error){
				return  res.status(500).json({response: 'Internal Server Error'});
			}

			if(foundAttendance){
				return res.status(404).json({response: 'User already participating'});
			}

			if(!foundAttendance){
				var newAttendance = new Attendance({
					user: mongoose.Types.ObjectId(xss(req.principal.user._id)),
					event: mongoose.Types.ObjectId(xss(req.params.event)),
					broughtTicket: false,
					onSeatPicker: false,
					dateArriving: new Date(),
					accommodation: "",
					transportPlans: "",
					location: "",
					inFacebookChat: false
				});

				newAttendance.save(function (error, saved) {
					if(error){
						return  res.status(500).json({response: 'Internal Server Error'});
					}

					if(saved){
						return res.status(200).json({response: 'Ok'});
					}
				});
			}

		});
	}

	if(req.body.attendance === false){

		Attendance.remove({user: req.principal.user._id, event: xss(req.params.event)}, function (error) {

			if(error){
				return  res.status(500).json({response: 'Internal Server Error'});
			}

			if(!error){
				return res.status(200).json({response: 'Ok'});
			}

		});

	}

});

/**
 * Delete (user) registration for event
 */
router.delete('/attendee/:user/:event', authenticate, function (req, res) {

	if((req.params.user === req.principal.user._id) || isAdmin()){

		Attendance.remove({user: xss(req.params.user), event: xss(req.params.event)}, function (error) {

			if(error){

				res.status(500).json({response: 'Internal Server Error'});

			} else {

				res.status(200).json({response: 'Ok'});

			}

		});

	} else {

		return res.status(401).json({error: 'Invalid Access'});

	}

});



//TODO: In hindsight, this is a jankey way of doing it.......
//http://mongoosejs.com/docs/subdocs.html#altsyntax
//Leverage above instead

router.post('/events', authenticate, isAdmin, function (req, res) {

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

router.post('/events/:id', authenticate, isAdmin, function (req, res) {

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

router.delete('/events/:id', authenticate, isAdmin, function (req, res) {

	Event.remove({_id: xss(req.params.id)}, function (error) {
		if(error){
			return res.status(500).json({error: 'Internal Server Error'});
		} else {
			return res.status(200).json({error: 'Done'});
		}
	})

});

router.post('/booking', authenticate, isAdmin, function (req, res) {

	var filteredRooms = [];

	req.body.booking.rooms.forEach(function (room) {

		var r = {
			roomOccupants: []
		};

		room.roomOccupants.forEach(function (occupants) {
			r.roomOccupants.push(xss(occupants.occupant));
		});

		filteredRooms.push(r);
	});

	var booking = new Booking({
		event: xss(req.body.event),
		booking: {
			bookedBy : xss(req.body.booking.bookedBy),
			totalCost : xss(req.body.booking.totalCost),
			roomType: xss(req.body.booking.bookedRoomType),
			rooms : filteredRooms
		}
	});

	booking.save(function (error, savedBooking) {

		if(error || !savedBooking){
			return res.status(500).json({error: 'Internal Server Error'});
		}

		if(savedBooking){
			return res.status(200).json({error: 'Done'});
		}

	});

});

router.get('/booking/:id', authenticate, function (req, res) {

	var filteredId = req.params.id;

	Booking.find({event: filteredId}, function (error, bookings) {

		if(error){
			return res.status(500).json({error: 'Internal Server Error'});
		}

		if(!bookings){
			return res.status(500).json({error: 'Internal Server Error'});
		}

		if(bookings){
			return res.status(200).json(bookings);
		}

	});

});

router.get('/booking/edit/:id', authenticate, isAdmin, function (req, res) {

	var filteredId = xss(req.params.id);

	Booking.findOne({_id: filteredId}, function (error, booking) {

		if(error){
			return res.status(500).json({error: 'Internal Server Error'});
		}

		if(!booking){
			return res.status(500).json({error: 'Internal Server Error'});
		}

		if(booking){
			return res.status(200).json(booking);
		}

	});

});

router.post('/booking/edit/:id', authenticate, isAdmin, function (req, res) {

	var filteredId = xss(req.params.id);

	var filteredRooms = [];

	req.body.booking.rooms.forEach(function (room) {

		var r = {
			roomOccupants: []
		};

		room.roomOccupants.forEach(function (occupants) {
			r.roomOccupants.push(xss(occupants.occupant));
		});

		filteredRooms.push(r);
	});

	var updatedBooking = {
		event: xss(req.body.event),
		booking: {
			bookedBy : xss(req.body.booking.bookedBy),
			totalCost : xss(req.body.booking.totalCost),
			roomType: xss(req.body.booking.bookedRoomType),
			rooms : filteredRooms
		}
	};

	Booking.findByIdAndUpdate(filteredId, {
		$set: {
			event: updatedBooking.event,
			booking: updatedBooking.booking
		}
	}, {new: true}, function (error) {

		if(error){

			return res.status(500).json({error: 'Internal Server Error'});

		} else {

			return res.status(200).json({error: 'Done'});

		}
	});
});

router.delete('/booking/:id', authenticate, isAdmin, function (req, res) {

	var filteredId = xss(req.params.id);

	Booking.remove({_id: filteredId}, function (error) {

		if(error){

			return res.status(500).json({error: 'Internal Server Error'});

		} else {

			return res.status(200).json({error: 'Done'});

		}

	});

});

/**
 * Get all jerseys for _event
 */
router.get('/jersey/:event', authenticate, function (req, res) {

	var filteredId = xss(req.params.event);

	Jersey.find({event: filteredId}).populate('user').exec(function (error, jerseys) {

		if(error){
			return res.status(500).json({error: 'Internal Server Error'});
		}

		if(!jerseys){
			return res.status(404).json({error: 'No Jerseys Found'});
		}

		if(jerseys){
			return res.status(200).json(jerseys);
		}

	});

});

/**
 * Get user jerseys for _event
 */
router.get('/jersey/:event/:user', authenticate, function (req, res) {

	var filteredId = xss(req.params.event);
	var filteredUserId = xss(req.params.user);

	Jersey.findOne({event: filteredId, user: filteredUserId}).populate('user').exec(function (error, jerseys) {

		if(error){
			return res.status(500).json({error: 'Internal Server Error'});
		}

		if(!jerseys){
			return res.status(404).json({error: 'Jersey not found'});
		}

		if(jerseys){
			return res.status(200).json(jerseys);
		}

	});

});


/**
 * Add a jersey for a user in an _event
 */
router.post('/jersey/:event/:user', authenticate, function (req, res) {

	var filteredEventId = xss(req.params.event);
	var filteredUserId = xss(req.params.user);

	if((req.principal.user._id === filteredUserId) || checkAdmin(req.principal.user)){

		Jersey.findOne({event: filteredEventId, user: filteredUserId}).populate('user').exec(function(error, found){

			if(error){
				return res.status(500).json({error: 'Internal Server Error'});
			}

			if(found){
				return res.status(500).json({error: 'Internal Server Error'});
			}

			if(!found){
				var newJersey = new Jersey({

					event: filteredEventId,
					user: filteredUserId,
					size: req.body.size,
					hidden: req.body.hidden,
					paid: false

				});

				newJersey.save(function (error, savedJersey) {
					if(error){
						return res.status(500).json({error: 'Internal Server Error'});
					}

					if(!savedJersey){
						return res.status(500).json({error: 'Internal Server Error'});
					}

					if(savedJersey){
						return res.status(200).json({error: 'Done'});
					}
				});
			}

		});

	} else {
		return res.status(401).json({error: 'Invalid Access Token'});
	}
});

router.delete('/jersey/:event/:user', authenticate, function (req, res) {

	var filteredEventId = xss(req.params.event);
	var filteredUserId = xss(req.params.user);

	if((req.principal.user._id === filteredUserId) || checkAdmin(req.principal.user)){

		Jersey.remove({event: filteredEventId, user: filteredUserId}).populate('user').exec(function (error) {
			if(error){
				return res.status(500).json({error: 'Internal Server Error'});
			}

			if(!error){
				return res.status(200).json({error: 'Done'});
			}
		})

	} else {
		return res.status(401).json({error: 'Invalid Access Token'});
	}

});

router.post('/jersey/update/:event/:user', authenticate, function (req, res) {
	var filteredEventId = xss(req.params.event);
	var filteredUserId = xss(req.params.user);

	if((req.principal.user._id === filteredUserId) || checkAdmin(req.principal.user)){

		Jersey.update({event: filteredEventId, user: filteredUserId}, {

			$set: {
				size: xss(req.body.size),
				hidden: req.body.hidden,
				paid: req.body.paid
			}

		}).exec(function (error) {

			if(error){
				return res.status(500).json({error: 'Internal Server Error'});
			}

			if(!error){
				return res.status(200).json({error: 'Done'});
			}

		});


	} else {
		return res.status(401).json({error: 'Invalid Access Token'});
	}

});

router.get('/quiz/:id', authenticate, function (req, res) {

	var filterdId = xss(req.params.id);

	Quiz.findOne({_id: filterdId}).populate(['user', 'bookedBy']).exec(function (error, foundQuiz) {

		if(error){
			return res.status(500).json({error: 'Internal Server Error'});
		}

		if(!foundQuiz){
			return res.status(404).json({error: 'No Quiz Found'});
		}

		if(foundQuiz){
			return res.status(200).json(foundQuiz);
		}

	});

});

router.get('/quiz/event/:event', authenticate, function (req, res) {

	var filteredEvent = xss(req.params.event);


	Quiz.find({"event" : filteredEvent}).populate(['bookedBy', 'attendees.user']).exec(function (error, foundQuiz) {

		if(error){
			return res.status(500).json({error: 'Internal Server Error'});
		}

		if(!foundQuiz){
			return res.status(404).json({error: 'No Quiz Found'});
		}

		if(foundQuiz){
			return res.status(200).json(foundQuiz);
		}

	});

});

router.post('/quiz/:event', authenticate, isAdmin, function (req, res) {

	var filteredAttendees = [];

	req.body.attendees.forEach(function (a) {
		if(a.user !== ''){
			filteredAttendees.push({
				user: mongoose.Types.ObjectId(a.user),
				paid: a.paid
			});
		} else {
			filteredAttendees.push({})
		}
	});

	var quizTable = new Quiz({

		tableNumber: xss(req.body.tableNumber),
		event: mongoose.Types.ObjectId(xss(req.params.event)),
		bookedBy: mongoose.Types.ObjectId(xss(req.body.bookedBy)),
		paypalLink: xss(req.body.paypalLink),
		tableType: xss(req.body.tableType),
		attendees: filteredAttendees

	});

	quizTable.save(function (error, newTable) {

		if(error){
			return res.status(500).json({error: 'Internal Server Error'});
		}

		if(!newTable){
			return res.status(500).json({error: 'Internal Server Error'});
		}

		if(newTable){
			return res.status(200).json({error: 'Done'});
		}

	});

});

router.post('/quiz/update/:id', authenticate, isAdmin, function (req, res) {

	var filteredId = xss(req.params.id);

	var filteredAttendees = [];

	req.body.attendees.forEach(function (a) {
		if(a.user !== ''){
			filteredAttendees.push({
				user: mongoose.Types.ObjectId(a.user),
				paid: a.paid
			});
		} else {
			filteredAttendees.push({})
		}
	});

	Quiz.update({_id: filteredId}, {

		$set: {
			"tableNumber" : xss(req.body.tableNumber),
			"event":  mongoose.Types.ObjectId(xss(req.body.event)),
			"bookedBy":  mongoose.Types.ObjectId(xss(req.body.bookedBy)),
			"paypalLink": xss(req.body.paypalLink),
			"tableType": xss(req.body.tableType),
			"attendees": filteredAttendees
		}

	}, function (error) {

		if(error){
			return res.status(500).json({error: 'Internal Server Error'});
		}

		if(!error){
			return res.status(200).json({error: 'Done'});
		}

	});


});

router.delete('/quiz/:id', authenticate, isAdmin, function (req, res) {

	var filteredId = xss(req.params.id);

	Quiz.remove({_id: filteredId}, function (error) {

		if(error){
			return res.status(500).json({error: 'Internal Server Error'});
		}

		if(!error){
			return res.status(200).json({error: 'Done'});
		}

	});

});


function isAdmin(req, res, next){
	if(req.principal.user.admin === true){
		return next();
	} else {
		return res.status(401).json({error: 'Invalid Access Token'});
	}
}

function checkAdmin(user){
	if(user.admin === true){
		return true;
	} else {
		return false;
	}
}

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