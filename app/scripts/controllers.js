'use strict';

/* Controllers */

var everthisControllers = angular.module('everthisControllers', []);

everthisControllers.controller('everthisFilmsCtrl', ['$scope', '$location', 'Posts',
    function($scope, $location, Posts) {
        $scope.film = Posts.query();
        $scope.showIcon = Math.floor(Math.random()*2);
    }
]);
