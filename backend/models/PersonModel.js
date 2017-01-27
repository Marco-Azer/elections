/**
 * Created by marcoazer on 2017-01-09.
 */

var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;

var PersonSchema = new Schema({
    'title': String,
    'first_name': String,
    'last_name': String,
    'apt_number': {
        'type': String,
        'default': ''
    },
    'street_number': String,
    'street_name': String,
    'postal_code': String,
    'home_phone': {
        'type': String,
        'default': ''
    },
    'cell_phone': {
        'type': String,
        'default': ''
    },
    'serial': String,
    'voted': {
        'type': Boolean,
        'default': false
    },
    'group_id': String
});

PersonSchema.statics.GetVoted = function (next) {
    this.find({'voted': true}, function(err, data){
        if(err)
            return next(err, null);
        else
            return next(null, data);
    });
};

PersonSchema.statics.GetUnVoted = function(next){
    this.find({'voted': false}, function(err, data){
        if(err)
            return next(err, null);
        else
            return next(null, data);
    });
};

PersonSchema.statics.GetVotedCount = function (next) {
    this.count({'voted': true}, function(err, data){
        if(err)
            return next(err, null);
        else
            return next(null, data);
    });
};

PersonSchema.statics.GetUnVotedCount = function(next){
    this.count({'voted': false}, function(err, data){
        if(err)
            return next(err, null);
        else
            return next(null, data);
    });
};

PersonSchema.statics.GetPerson = function(person, next){
    this.find(person, function(err, data){
        if(err)
            return next(err, null);
        else
            return next(null, data);
    });
};

PersonSchema.statics.SetVote = function (id, next) {
    this.findByIdAndUpdate(id, {'voted': true}, {'new': true}, function(err, data){
        if(err)
            return next(err, null);
        else
            return next(null, data);
    });
};

PersonSchema.statics.SetUnVote = function (id, next) {
    this.findByIdAndUpdate(id, {'voted': false}, {'new': true}, function(err, data){
        if(err)
            return next(err, null);
        else
            return next(null, data);
    });
};

PersonSchema.statics.SetVoteByPerson = function (person, next) {
    this.findOneAndUpdate(person, {'voted': true}, {'new': true}, function(err, data){
        if(err)
            return next(err, null);
        else
            return next(null, data);
    });
};

PersonSchema.statics.SetUnVoteByPerson = function (person, next) {
    this.findOneAndUpdate(person, {'voted': false}, {'new': true}, function(err, data){
        if(err)
            return next(err, null);
        else
            return next(null, data);
    });
};

PersonSchema.statics.GetPersonWithGroup = function(groupId, next){
    this.find({'group_id': groupId, 'voted': false}, '-_id serial first_name last_name cell_phone home_phone apt_number street_number street_name', function(err, data){
        if(err)
            return next(err, null);
        else
            return next(null, data);
    });
};

module.exports = Mongoose.model('Person', PersonSchema);
