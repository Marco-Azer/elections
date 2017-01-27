/**
 * Created by marcoazer on 2017-01-17.
 */

var Mongoose = require('mongoose');
var Bcrypt = require('bcryptjs');
var User = require('../models/UserModel');


module.exports = function(App){
    App.post('/user/new', function(req, res){
        var user_name = req.body['user_name'];
        var password = req.body['password'];
        var Salt = Bcrypt.genSaltSync(10);
        var hash = Bcrypt.hashSync(password, Salt);

        var newUser = new User({
            'user_name': user_name,
            'password': hash
        });
        newUser.save(function(err, data){
            if(err){
		console.log(err);
                //throw err;
            } else{
                res.send(200);
            }
        });
    });

    App.post('/user/login', function(req, res){
        var user_name = req.body['user_name'];
        var password = req.body['password'];
        User.findOne({'user_name': user_name}, function(err, data){
            if(err){
		console.log(err);
                //throw err;
            } else if(data){
                var hash = data['password'];
                var login = Bcrypt.compareSync(password, hash);
                if(login){
                    res.sendStatus(200);
                } else{
                    res.sendStatus(401);
                }
            } else{
                res.sendStatus(401);
            }
        })
    });
};
