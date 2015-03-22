'use strict';

/* App Module */

var everthisApp = angular.module('everthisApp', [
    'ngResource',
    'ngRoute',
    'everthisControllers',
    'everthisServices'
]);

everthisApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/', {
            templateUrl: 'views/default.html',
            controller: 'everthisFilmsCtrl'
        }).
        when('/views/category', {
            templateUrl: 'views/category/category_index.html',
            controller: 'everthisFilmsCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
    }
]);


/* global angular */
/**
 * let script tag come into effect in ng-view
 * @param  {[type]} ) {             return {    restrict: 'E',    scope: false,    link: function(scope, elem, attr)    {      if (attr.type [description]
 * @return {[type]}   [description]
 */
everthisApp.directive('script', function() {
    return {
        restrict: 'E',
        scope: false,
        link: function(scope, elem, attr) {
            if (attr.type === 'text/javascript-lazy') {
                var s = document.createElement("script");
                s.type = "text/javascript";
                var src = elem.attr('src');
                if (src !== undefined) {
                    s.src = src;
                } else {
                    var code = elem.text();
                    s.text = code;
                };

                /* fix for JS only carousel. :( */
                var scripts = document.head.getElementsByTagName("script");
                  for (var i=0;i<scripts.length;i++) {
                     if (scripts[i].src.indexOf("carousel") > -1) {
                        carousel.stopPlay();
                     }
                  }
                  /* end of fix */
                  document.head.appendChild(s);
                elem.remove();
            }
        }
    };
});
