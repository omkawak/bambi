/**
 * Module dependencies.
 */

var express = require('express');
var partials = require('express-partials');
var http = require('http');
var path = require('path');
var _ = require('lodash');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(partials());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'app')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

var staticEndPoints = [
    "/help",
    "/contact",
    "/terms",
    "privacy"
];

app.use(function(req, res) {
    if (_.indexOf(staticEndPoints, req.url) < 0) {
        // Render single page application
        res.render('app', {
            title: 'Express'
        });
    } else {
        next();
    }
});

app.get("/help", function(req, res) {
	res.render('pages/help', {
		layout: 'layouts/static',
		title: 'Help'
	})
});

app.get("/contact", function(req, res) {
    res.render('pages/contact', {
        layout: 'layouts/static',
        title: 'Contact Us'
    })
});

app.get("/privacy", function(req, res) {
    res.render('pages/privacy', {
        layout: 'layouts/static',
        title: 'Privacy'
    })
});

app.get("/terms", function(req, res) {
    res.render('pages/terms', {
        layout: 'layouts/static',
        title: 'Terms & Conditions'
    })
});



http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
