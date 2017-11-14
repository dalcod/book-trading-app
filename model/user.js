var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
var salt_f = 10;
var noop = function() {};

var userSchema = new Schema({
    username: {type: String, required: 'true', unique: 'true'},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    city: String,
    state: String,
    name: String,
    userData: {
        receivedOffers: [],
        acceptedOffers: [],
        myOffers: [],
        myAcceptedOffers: []
    },
    createdAt: {type: Date, default: Date.now}
});

userSchema.pre('save', function(next){
    var user = this;
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(salt_f, function(err, salt){
        if (err) return next(err);
        bcrypt.hash(user.password, salt, noop, function(err, hashedPassword){
            if (err) return next(err);
            user.password = hashedPassword;
            next();
        });
    });
});

userSchema.methods.checkPassword = function(guess, cb) {
    bcrypt.compare(guess, this.password, function(err, isMatch){
        if(err) return cb(err);
        cb(err, isMatch);
    });
};

module.exports = mongoose.model('BooksAppUser', userSchema);