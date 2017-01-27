/**
 * Created by marcoazer on 2017-01-09.
 */

var Express = require("express");
var Mongoose = require("mongoose");
var BodyParser = require("body-parser");

Mongoose.connect("mongodb://localhost/elections");

var App = Express();
App.use(BodyParser.urlencoded({extended: false}));

App.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var PersonRoutes = require('./routes/PersonRoutes');
PersonRoutes(App);

var UserRoutes = require('./routes/UserRoutes');
UserRoutes(App);

var port = 3000;
App.listen(port, function(){
    console.log('App is listening on port ' + port);
});
