/**
 * Created by marcoazer on 2017-01-09.
 */

var Mongoose = require('mongoose');
var Person = require('../models/PersonModel');


module.exports = function(app){
    app.get('/person', function (req, res) {
        Person.GetPerson(req.query, function (err, data) {
            if(err) {
		console.log(err);
                //throw err;
            } else{
                res.send(data);
            }
        });
    });

    app.post('/person', function(req, res){
        var newPerson = new Person(req.body);
        newPerson.save(function(err, data){
           if(err){
		console.log(err);
               //throw err;
           } else{
               res.send(data);
           }
        });
    });

    app.post('/person/vote/:id', function(req, res){
       Person.SetVote(req.params.id, function(err, data){
           if(err){
		console.log(err);
               //throw err;
           }else{
               res.send(data);
           }
       });
    });

    app.post('/person/unvote/:id', function(req, res){
        Person.SetUnVote(req.params.id, function(err, data){
            if(err){
		console.log(err);
                //throw err;
            }else{
                res.send(data);
            }
        });
    });

    app.post('/person/vote', function(req, res){
       Person.SetVoteByPerson(req.body, function(err, data){
           if(err){
		console.log(err);
               //throw err;
           }else{
               res.send(data);
           }
       });
    });

    app.post('/person/unvote', function(req, res){
        Person.SetUnVoteByPerson(req.body, function(err, data){
            if(err){
		console.log(err);
                //throw err;
            }else{
                res.send(data);
            }
        });
    });

    app.get('/person/voted', function(req, res){
       Person.GetVoted(function(err, data){
           if(err){
		console.log(err);
               //throw err;
           }else{
               res.send(data);
           }
       });
    });

    app.get('/person/unvoted', function(req, res){
        Person.GetUnVoted(function(err, data){
            if(err){
		console.log(err);
                //throw err;
            }else{
                res.send(data);
            }
        });
    });

    app.get('/person/voted/count', function(req, res){
       Person.GetVotedCount(function(err, data){
           if(err){
		console.log(err);
               //throw err;
           }else{
               res.send({'voted': data});
           }
       });
    });

    app.get('/person/unvoted/count', function(req, res){
        Person.GetUnVotedCount(function(err, data){
            if(err){
		console.log(err);
                //throw err;
            }else{
                res.send({'unvoted': data});
            }
        });
    });

    app.get('/person/group/:groupId', function(req, res){
       Person.GetPersonWithGroup(req.params.groupId, function(err, data) {
           if (err){
		console.log(err);
               //throw err;
           } else{
               res.send(data);
           }
       });
    });
};
