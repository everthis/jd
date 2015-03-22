'use strict';

/* Services */

var everthisServices = angular.module('everthisServices', ['ngResource']);

everthisServices.factory('Posts', ['$resource',
  function($resource){
    return $resource('json/:postId.json', {}, {
      query: {method:'GET', params:{postId:'default'}, isArray:false}
    });
  }]);
