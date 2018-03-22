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
const Competition = require('../models/competition');
const Meal = require('../models/meal');
const Seat = require('../models/seatPicker');

router.get('/users', function (req, res) {

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

	if((req.params.id === req.principal.user._id) || checkAdmin(req.principal.user)){

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

	if(req.params.user === req.principal.user._id || checkAdmin(req.principal.user)){

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

			return res.status(200).json(attendance);
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

	if((req.params.user === req.principal.user._id) || checkAdmin(req.principal.user)){

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

router.post('/events', authenticate, isAdmin, function (req, res) {

	var newEvent = new Event({
		name:  xss(req.body.formValue.name),
		fromDate: xss(req.body.formValue.fromDate),
		toDate: xss(req.body.formValue.toDate),
		seatPickerUrl: xss(req.body.formValue.seatPickerUrl),
		eventLocation: xss(req.body.formValue.eventLocation),
		clanTracker :  xss(req.body.formValue.clanTracker),
		clanPage : xss(req.body.formValue.clanPage),
		chatLink : xss(req.body.formValue.chatLink),
		hotelCheckin : xss(req.body.formValue.hotelCheckin),
		hotelCheckinTime: xss(req.body.formValue.hotelCheckinTime),
		hotelCheckout : xss(req.body.formValue.hotelCheckout),
		hotelCheckoutTime : xss(req.body.formValue.hotelCheckoutTime),
		hotelAddress : xss(req.body.formValue.hotelAddress),
		hotelNumber : xss(req.body.formValue.hotelNumber),
		hotelName : xss(req.body.formValue.hotelName),
		jerseySizeChart : xss(req.body.formValue.jerseySizeChart),
		jerseyPaymentLink : xss(req.body.formValue.jerseyPaymentLink),
		jerseyDesignLink : xss(req.body.formValue.jerseyDesignLink),
		mealAddress : xss(req.body.formValue.mealAddress),
		mealName : xss(req.body.formValue.mealName),
		mealTime : xss(req.body.formValue.mealTime),
		mealDate : xss(req.body.formValue.mealDate),
		showJersey : xss(req.body.formValue.showJersey),
		showQuiz : xss(req.body.formValue.showQuiz),
		showComps : xss(req.body.formValue.showComps),
		showSeating : xss(req.body.formValue.showSeating),
		showMeal : xss(req.body.formValue.showMeal)
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

	Event.update({_id: filteredEventId},
		{$set: {
				name: xss(req.body.formValue.name),
				fromDate: xss(req.body.formValue.fromDate),
				toDate: xss(req.body.formValue.toDate),
				seatPickerUrl: xss(req.body.formValue.seatPickerUrl),
				eventLocation: xss(req.body.formValue.eventLocation),
				clanTracker :  xss(req.body.formValue.clanTracker),
				clanPage : xss(req.body.formValue.clanPage),
				chatLink : xss(req.body.formValue.chatLink),
				hotelCheckin : xss(req.body.formValue.hotelCheckin),
				hotelCheckinTime: xss(req.body.formValue.hotelCheckinTime),
				hotelCheckout : xss(req.body.formValue.hotelCheckout),
				hotelCheckoutTime : xss(req.body.formValue.hotelCheckoutTime),
				hotelAddress : xss(req.body.formValue.hotelAddress),
				hotelNumber : xss(req.body.formValue.hotelNumber),
				hotelName : xss(req.body.formValue.hotelName),
				jerseySizeChart : xss(req.body.formValue.jerseySizeChart),
				jerseyPaymentLink : xss(req.body.formValue.jerseyPaymentLink),
				jerseyDesignLink : xss(req.body.formValue.jerseyDesignLink),
				mealAddress : xss(req.body.formValue.mealAddress),
				mealName : xss(req.body.formValue.mealName),
				mealTime : xss(req.body.formValue.mealTime),
				mealDate : xss(req.body.formValue.mealDate),
				showJersey : xss(req.body.formValue.showJersey),
				showQuiz : xss(req.body.formValue.showQuiz),
				showComps : xss(req.body.formValue.showComps),
				showSeating : xss(req.body.formValue.showSeating),
				showMeal : xss(req.body.formValue.showMeal)

		}}, function (error) {

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
			r.roomOccupants.push(mongoose.Types.ObjectId(xss(occupants.occupant)));
		});

		filteredRooms.push(r);
	});

	var booking = new Booking({
		event: xss(req.body.event),
		booking: {
			bookedBy : mongoose.Types.ObjectId(xss(req.body.booking.bookedBy)),
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

	Booking.find({event: mongoose.Types.ObjectId(filteredId)}).populate('event').populate('booking.bookedBy').populate('booking.rooms.roomOccupants').exec(function (error, bookings) {

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

	Booking.findOne({_id: filteredId}).populate(['event', 'booking.bookedBy', 'booking.rooms.roomOccupants']).exec(function (error, booking) {

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

/**
 * Get all comps for event
 */
router.get('/comps/all/:event', authenticate, function (req, res) {

	Competition.find({event: req.params.event}).populate(['event', 'mainTeam', 'subs']).exec(function (error, foundComps) {

		if(error){
			return res.status(500).json({error: 'Internal Server Error'});
		}

		if(!foundComps){
			return res.status(404).json({error: 'No Comps Found'});
		}

		if(foundComps){
			return res.status(200).json(foundComps);
		}

	});

});

/**
 * Get a single comp
 */
router.get('/comps/:id', authenticate, function (req, res) {
	Competition.findOne({_id: xss(req.params.id)}).populate(['event', 'mainTeam', 'subs']).exec(function (error, foundComps) {

		if(error){
			return res.status(500).json({error: 'Internal Server Error'});
		}

		if(!foundComps){
			return res.status(404).json({response: 'No Comps Found'});
		}

		if(foundComps){
			return res.status(200).json(foundComps);
		}

	});
});

/**
 * Add a new comp
 */
router.post('/comps/all/:id', authenticate, isAdmin, function (req, res) {

	let mainTeam = [];
	let subTeam = [];

	req.body.mainTeam.forEach(function (user) {
		mainTeam.push(xss(user));
	});

	req.body.subs.forEach(function (user) {
		subTeam.push(xss(user))
	});


	var newComp = new Competition({
		event: req.params.id,
		game: xss(req.body.game),
		teamName: xss(req.body.teamName),
		mainTeam: mainTeam,
		subs: subTeam
	});

	newComp.save(function (error, savedComp) {
		if(error){
			return res.status(500).json({error: 'Internal Server Error'});
		}

		if(!error){
			return res.status(200).json({response: 'Ok'});
		}
	});

});

/**
 * Update a comp
 */
router.post('/comps/:id', authenticate, isAdmin, function (req, res) {
	let mainTeam = [];
	let subTeam = [];

	req.body.mainTeam.forEach(function (user) {
		mainTeam.push(xss(user));
	});

	req.body.subs.forEach(function (user) {
		subTeam.push(xss(user))
	});

	Competition.update({_id: req.params.id}, { $set: {
			game: xss(req.body.game),
			teamName: xss(req.body.teamName),
			mainTeam: mainTeam,
			subs: subTeam
		}},
		function (error) {

			if(error){
				return res.status(500).json({error: 'Internal Server Error'});
			}

			if(!error){
				return res.status(200).json({response: 'Ok'});
			}

		}
	);
});

/**
 * Delete a comp
 */
router.delete('/comps/:id', authenticate, function (req, res) {

	Competition.remove({_id: req.params.id}, function (error) {

		if(error){
			return res.status(500).json({error: 'Internal Server Error'});
		}

		if(!error){
			return res.status(200).json({response: 'Ok'});
		}

	});

});

/**
 * Get all meals for event
 */
router.get('/meal/all/:id', authenticate, function (req, res) {
	Meal.find({event: xss(req.params.id)}).populate(['event', 'user', 'passengers']).exec(function (error, foundMeals) {

		if(error){
			return res.status(500).json({error: 'Internal Server Error'});
		}

		if(!foundMeals){
			return res.status(404).json({error: 'No Meals Found'});
		}

		if(foundMeals){
			return res.status(200).json(foundMeals);
		}

	});
});

/**
 * Get A single meal
 */
router.get('/meal/:id', authenticate, function (req, res) {
	Meal.findOne({_id: xss(req.params.id)}).populate(['event', 'user', 'passengers']).exec(function (error, foundMeals) {

		if(error){
			return res.status(500).json({error: 'Internal Server Error'});
		}

		if(!foundMeals){
			return res.status(404).json({error: 'No Meals Found'});
		}

		if(foundMeals){
			return res.status(200).json(foundMeals);
		}

	});
});

/**
 * Get A  meal by user
 */
router.get('/meal/user/:id', authenticate, function (req, res) {
	Meal.findOne({user: xss(req.params.id)}).populate(['event', 'user', 'passengers']).exec(function (error, foundMeals) {

		if(error){
			return res.status(500).json({error: 'Internal Server Error'});
		}

		if(!foundMeals){
			return res.status(404).json({error: 'No Meals Found'});
		}

		if(foundMeals){
			return res.status(200).json(foundMeals);
		}

	});
});

/**
 * Add a meal
 */
router.post('/meal/all/:id/:user', authenticate, function (req, res) {

	if((req.principal.user === req.params.user) || isAdmin){

		var newPassengers = [];

		if(req.body.drivingNumberOfSeats > 0){
			if(req.body.passengers){
				req.body.passengers.forEach(function (p) {
					newPassengers.push(xss(p));
				});
			}
		}

		var newMeal = new Meal({
			event: xss(req.params.id),
			user: xss(req.params.user),
			drivingNumberOfSeats: req.body.drivingNumberOfSeats,
			needsLift: req.body.needsLift,
			dietaryRequirements: xss(req.body.dietaryRequirements),
			passengers: newPassengers
		});

		newMeal.save(function (error, savedMeal) {
			if(error){
				return res.status(500).json({error: 'Internal Server Error'});
			}

			if(!error){
				return res.status(200).json({response: 'Ok'});
			}
		});


	} else {
		return res.status(401).json({error: 'Invalid Access'});
	}



});

/**
 * Update a meal
 */
router.post('/meal/:id', authenticate, function (req, res) {

	if((req.principal.user === req.params.user) || isAdmin){

		var newPassengers = [];

		if(req.body.drivingNumberOfSeats > 0){
			if(req.body.passengers) {
				req.body.passengers.forEach(function (p) {
					if(p !== ''){
						newPassengers.push(p);
					} else {
						newPassengers.push(undefined);
					}
				});
			}
		}

		Meal.update({_id: req.params.id}, {
			$set: {
				drivingNumberOfSeats: req.body.drivingNumberOfSeats,
				needsLift: req.body.needsLift,
				dietaryRequirements: xss(req.body.dietaryRequirements),
				passengers: newPassengers
			}
		}, function (error) {
			if(error){
				return res.status(500).json({error: 'Internal Server Error'});
			}

			if(!error){
				return res.status(200).json({response: 'Ok'});
			}
		});

	} else {

		return res.status(401).json({error: 'Invalid Access'});

	}

});

/**
 * Delete a meal
 */
router.delete('/meal/:id', authenticate, function (req, res) {
	Meal.remove({_id: req.params.id}, function (error) {

		if(error){
			return res.status(500).json({error: 'Internal Server Error'});
		}

		if(!error){
			return res.status(200).json({response: 'Ok'});
		}

	});
});


router.get('/seat/single/:seat', authenticate, function (req, res) {


	Seat.findOne({_id: req.params.seat}, function (error, foundSeat) {
		if(error){
			return res.status(500).json({error: 'Internal Server Error!'});
		}

		if(!foundSeat){
			return res.status(404).json({response: 'No Seats Found'});
		}

		if(foundSeat){
			return res.status(200).json(foundSeat);
		}
	});

});

router.get('/seat/all/:id', authenticate, function (req, res) {

	Seat.find({event: req.params.id}).populate(['event', 'user']).exec(function (error, foundSeats) {

		if(error){
			return res.status(500).json({error: 'Internal Server Error'});
		}

		if(!foundSeats){
			return res.status(404).json({response: 'No Seats Found'});
		}

		if(foundSeats){
			return res.status(200).json(foundSeats);
		}

	});

});

router.get('/seat/:user/:event', authenticate, function(req, res){

	Seat.findOne({event: req.params.event, user: req.params.user}).populate(['event', 'user']).exec(function (error, foundSeats) {

		if(error){
			return res.status(500).json({error: 'Internal Server Error'});
		}

		if(!foundSeats){
			return res.status(404).json({response: 'No Seats Found'});
		}

		if(foundSeats){
			return res.status(200).json(foundSeats);
		}

	});

});

router.post('/seat/:event', authenticate, function (req, res) {

	var newSeat = new Seat({

		event:  mongoose.Types.ObjectId(xss(req.params.event)),
		user: 	 mongoose.Types.ObjectId(xss(req.principal.user._id)),
		onPicker: xss(req.body.onPicker),
		actualSeat: '',
		notes: ''
	});

	newSeat.save(function (error) {

		if(error){
			return res.status(500).json({error: 'Internal Server Error'});
		}

		if(!error){
			return res.status(200).json({response: 'Ok'});
		}

	});

});

router.post('/seat/all/:seat', authenticate, function (req, res) {

	if(checkAdmin(req.principal.user)){

		Seat.update({_id: req.params.seat}, {
			$set: {
				onPicker : xss(req.body.onPicker),
				actualSeat : xss(req.body.actualSeat),
				notes : xss(req.body.notes)
			}
		}, function (error) {
			if(error){
				return res.status(500).json({error: 'Internal Server Error'});
			}

			if(!error){
				return res.status(200).json({response: 'Ok'});
			}
		});

	} else {

		Seat.findOne({_id: req.params.seat}, function (error, foundSeat) {

			if(foundSeat.user._id === req.principal.user._id){
				Seat.update({_id: req.params.seat}, {
					$set: {
						onPicker : xss(req.body.onPicker)
					}
				}, function (error) {
					if(error){
						return res.status(500).json({error: 'Internal Server Error'});
					}

					if(!error){
						return res.status(200).json({response: 'Ok'});
					}
				});
			} else {
				return res.status(401).json({error: 'Invalid Access'});
			}

		});

	}

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