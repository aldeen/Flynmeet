/**
* Routes
* @namespace flynmeet.routes
*/

(function () {
    'use strict';

    angular
    .module('flynmeet.routes')
    .config(config);

    config.$inject = ['$routeProvider'];
    /**
    * @name config
    * @desc Define valid application routes
    */
    function config($routeProvider) {
        $routeProvider.when('/exploring/', {
            templateUrl: '/static/templates/search.html',
            controller: 'SearchController',
        })
        .when('/buildingyourdreams/', {
            templateUrl: '/static/templates/results.html',
            controller: 'ResController',
        })
        .otherwise({
            redirectTo: "/"
        });
    }
})();
