var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');

var app = express();

var routes = require('./routes');
var strategy = require('./setuppassport');

var mongoUrl = "mongodb://sulphurv:3MorsKomWin@ds159670.mlab.com:59670/thearchive";
mongoose.connect(mongoUrl);
mongoose.connection.on('error', console.error.bind('error', console));

passport.use(strategy);
app.use(passport.initialize());

app.use(express.static(path.join(__dirname, 'dist')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(routes);

app.listen(3000, function(){
    console.log('Successfully connected on port 3000')
});