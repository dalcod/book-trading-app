var express = require("express");
var passportJWT = require("passport-jwt");
var User = require("./model/user");
var key = require("./secretKey");

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
jwtOptions.secretOrKey = key.secretKey;

var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, done){
    User.findById(jwt_payload.id, function(err, user){
        if (err) { done(err) }
        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    });
});

module.exports = strategy;