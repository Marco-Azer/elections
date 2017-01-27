/**
 * Created by marcoazer on 2017-01-17.
 */

var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;

var UserSchema = new Schema({
    'user_name': String,
    'password': String
});

module.exports = Mongoose.model('User', UserSchema);