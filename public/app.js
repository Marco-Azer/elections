/**
 * Created by marcoazer on 2017-01-10.
 */

var App = angular.module('ElectionsApp', ['ngRoute']);

App.config(function($routeProvider, $locationProvider){
    // $locationProvider.html5Mode(true);
    $routeProvider
        .when('/', {
            templateUrl: './login.html'
        })
        .when('/main', {
            templateUrl: './main.html'
        })
        .otherwise({
            redirectTo: '/'
        });
});

App.run(function($rootScope, $location, $window){
    $rootScope.$on('$routeChangeStart', function(event){
        if($window.localStorage.getItem('electionsLoggedIn') == "true"){
            $location.path('/main');
        }else{
            $location.path('/');
        }
    });
});

var ResetSearchQuery = function(personquery){
    for(var key in personquery){
        if(personquery[key] == "" || personquery[key] == null || personquery == undefined){
            delete personquery[key];
        }
    }
};

var RefreshPage = function ($scope, GetVoters, GetUnVoters, GetVotersCount, GetUnVotersCount) {
    GetVoters(function(err, data){
        if(err){
            console.log(err);
        } else{
            $scope.PeopleVoted = data;
        }
    });
    GetUnVoters(function(err, data){
        if(err){
            console.log(err);
        } else{
            $scope.PeopleUnVoted = data;
        }
    });
    GetVotersCount(function(err, data){
        if(err){
            console.log(err);
        } else{
            $scope.VotedCount= data['voted'];
        }
    });
    GetUnVotersCount(function(err, data){
        if(err){
            console.log(err);
        } else{
            $scope.UnVotedCount = data['unvoted'];
        }
    })
};

App.controller('MainController' , function($scope, $route, $httpParamSerializer, SearchForPerson, GetVoters, GetUnVoters, Vote, UnVote, VotePersonFactory, UnVotePersonFactory, GetGroupFactory, GetVotersCount, GetUnVotersCount){
    RefreshPage($scope, GetVoters, GetUnVoters, GetVotersCount, GetUnVotersCount);
    $scope.SearchPerson = function(){
        ResetSearchQuery($scope.personquery);
        var queryString = $httpParamSerializer($scope.personquery);
        SearchForPerson(queryString, function(err, data){
            if(err){
                console.log(err);
            } else{
                $scope.PeopleResultSet = data;
            }
        });
        //RefreshPage($scope, GetVoters, GetUnVoters);
    };

    $scope.VotePersonId = function(personId){
        Vote(personId, function(err){
            if(err){
                console.log(err);
            } else{
                RefreshPage($scope, GetVoters, GetUnVoters);
            }
        });
    };

    $scope.UnVotePersonId = function(personId){
        UnVote(personId, function(err){
            if(err){
                console.log(err);
            } else{
                RefreshPage($scope, GetVoters, GetUnVoters);
            }
        });
    };
    
    $scope.VotePerson = function(fname, lname, serial){
        VotePersonFactory(fname, lname, serial, function(err){
            if(err){
                console.log(err);
            } else{
                RefreshPage($scope, GetVoters, GetUnVoters, GetVotersCount, GetUnVotersCount);
            }
        });
    };

    $scope.UnVotePerson = function(fname, lname, serial){
        UnVotePersonFactory(fname, lname, serial, function(err){
            if(err){
                console.log(err);
            } else{
                RefreshPage($scope, GetVoters, GetUnVoters, GetVotersCount, GetUnVotersCount);
            }
        });
    };

    $scope.GetGroup = function(){
        var groupId = $('#GroupDropDown').val();
        GetGroupFactory(groupId, function(err, data){
           if(err){
               console.log(err);
           } else{
               var columns = ["Serial", "First Name", "Last Name", "Street #", "Street Name", "Cell", "Home"];
               var rows = [];

               $.each(data, function(index, obj){
                   rows[index] = [];
                   rows[index].push(obj['serial']);
                   rows[index].push(obj['first_name']);
                   rows[index].push(obj['last_name']);
                   rows[index].push(obj['street_number']);
                   rows[index].push(obj['street_name']);
                   rows[index].push(obj['cell_phone']);
                   rows[index].push(obj['home_phone']);
               });
               var doc = new jsPDF('p', 'pt');
               doc.autoTable(columns, rows, {
                   'addPageContent': function(d){
                        doc.text('Group ' + groupId, 40, 30);
                   }
               });
               doc.save('Group' + groupId + '.pdf');
           }
        });
    };

    $scope.range = function(max){
        return new Array(max);
    };
});

App.controller('LoginController', function($window, $scope, $location, LoginFactory){
    $scope.login = function(){
        LoginFactory($scope.userName, $scope.userPassword, function(err){
            if(err){
                $location.path('/');
                $window.localStorage.setItem('electionsLoggedIn', false);
            } else{
                $location.path('/main');
                $window.localStorage.setItem('electionsLoggedIn', true);
            }
        });
    };
});

App.controller('NavbarController', function($scope, $location, $window){
   $scope.logout = function(){
       $location.path('/');
       $window.localStorage.setItem('electionsLoggedIn', false);
   };
});

App.factory('SearchForPerson', function($http){
    return function(queryString, next){
        $http({
            'method': 'GET',
            'url': 'http://35.160.14.22:3000/person?' + queryString,
            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(
            function(res){
                return next(null, res.data);
            },
            function(err){
                return next(err, null);
            }
        );
    };
});

App.factory('GetVoters', function($http){
    return function(next){
        $http({
            'method': 'GET',
            'url': 'http://35.160.14.22:3000/person/voted',
            'headers':{
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(
            function(res){
                return next(null, res.data);
            },
            function(err){
                return next(err, null);
            }
        );
    };
});

App.factory('GetUnVoters', function($http){
    return function(next){
        $http({
            'method': 'GET',
            'url': 'http://35.160.14.22:3000/person/unvoted',
            'headers':{
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(
            function(res){
                return next(null, res.data);
            },
            function(err){
                return next(err, null);
            }
        );
    };
});

App.factory('GetVotersCount', function($http){
    return function(next){
        $http({
            'method': 'GET',
            'url': 'http://35.160.14.22:3000/person/voted/count',
            'headers':{
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(
            function(res){
                return next(null, res.data);
            },
            function(err){
                return next(err, null);
            }
        );
    };
});

App.factory('GetUnVotersCount', function($http){
    return function(next){
        $http({
            'method': 'GET',
            'url': 'http://35.160.14.22:3000/person/unvoted/count',
            'headers':{
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(
            function(res){
                return next(null, res.data);
            },
            function(err){
                return next(err, null);
            }
        );
    };
});

App.factory('Vote', function($http){
   return function(personId, next){
       $http({
           'method': 'POST',
           'url': 'http://35.160.14.22:3000/person/vote/' + personId,
           'headers':{
               'Content-Type': 'application/x-www-form-urlencoded'
           }
       }).then(
           function(res){
               return next(null, res.data);
           },
           function(err){
               return next(err, null);
           }
       );
   };
});

App.factory('UnVote', function($http){
    return function(personId, next){
        $http({
            'method': 'POST',
            'url': 'http://35.160.14.22:3000/person/unvote/' + personId,
            'headers':{
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(
            function(res){
                return next(null, res.data);
            },
            function(err){
                return next(err, null);
            }
        );
    };
});

App.factory('VotePersonFactory', function($http){
   return function(fname, lname, serial, next){
       $http({
           'method': 'POST',
           'url': 'http://35.160.14.22:3000/person/vote',
           'headers':{
               'Content-Type': 'application/x-www-form-urlencoded'
           },
	    'data': $.param({
		'first_name': fname,
		'last_name': lname,
		'serial': serial
	    })
       }).then(
           function(res){
               return next(null, res.data);
           },
           function(err){
               return next(err, null);
           }
       );
   };
});

App.factory('UnVotePersonFactory', function($http){
    return function(fname, lname, serial, next){
        $http({
            'method': 'POST',
            'url': 'http://35.160.14.22:3000/person/unvote',
            'headers':{
                'Content-Type': 'application/x-www-form-urlencoded'
            },
	    'data': $.param({
		'first_name': fname,
		'last_name': lname,
		'serial': serial
	    })
        }).then(
            function(res){
                return next(null, res.data);
            },
            function(err){
                return next(err, null);
            }
        );
    };
});

App.factory('GetGroupFactory', function($http){
    return function(groupId, next){
        $http({
            'method': 'GET',
            'url': 'http://35.160.14.22:3000/person/group/' + groupId,
            'headers':{
                'Content-Type': 'application/x-wwww-form-urlencoded'
            }
        }).then(
            function(res){
                return next(null, res.data);
            },
            function(err){
                return next(err, null);
            }
        )
    }
});

App.factory('LoginFactory', function($http, $location){
   return function(user_name, password, next){
       $http({
           "method": "POST",
           "url": "http://35.160.14.22:3000/user/login",
           "headers": {
               "Content-Type": "application/x-www-form-urlencoded"
           },
           data: $.param({
               user_name: user_name,
               password: password
           })
       })
       .then(function(res){
           return next(null);
       }, function(err){
            return next(err);
       });
   };
});
