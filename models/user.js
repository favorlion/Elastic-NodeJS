var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var passportLocalMongoose = require("passport-local-mongoose");
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
var SALT_WORK_FACTOR = 10;

var userSchema = new Schema({

    username: String,
    password: String,
    email: String,
    created_at: Date,
    expire_date: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
});

userSchema.pre('save', function(next) {
    var curDate = new Date();

    var user = this;

    if (!this.created_at)
        this.created_at = curDate;
    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {

        if (err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            user.password = hash;
            next();
        });

    });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {

    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

userSchema.statics.getAuthenticated = function(email, password, cb) {
    this.findOne({ email: email }, function(err, user) {
        if (err) return cb(err);

        if (!user) {
            return cb(null, null, reasons.NOT_FOUND);
        }

        user.comparePassword(password, function(err, isMatch) {
            if (err) return cb(err);
            if (isMatch) return cb(null, user);
            return cb(null, null);
        });
    });
};

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);