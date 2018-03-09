// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const passport = require('passport');
const mongoose = require('mongoose');
var csrf = require('csurf');

var env = process.env.NODE_ENV || 'development';
var config = require('./config')[env];


// Get our API routes
const api = require('./server/routes/api');
const auth = require('./server/routes/auth');

mongoose.connect(config.database.getCredentials());






const app = express();

app.use(passport.initialize());

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


app.use(express.static(path.join(__dirname, 'dist')));

app.use('/api', api);
app.use('/auth', auth);

// Catch all other routes and return the index file
app.get('*', function (req, res) {
	res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.use(csrf());
app.use(function (req, res, next) {
	res.cookie("XSRF-TOKEN",req.csrfToken());
	return next();
});

require('./server/models/passport')(passport);

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, function () {
	console.log('Server Started');
});