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
        $routeProvider.when('/en/exploring/', {
            templateUrl: '/static/templates/search_en.html',
            controller: 'SearchController',
        })
        .when('/en/trigger/', {
            templateUrl: '/static/templates/results_en.html',
            controller: 'ResController',
        })
        .when('/fr/exploring/', {
            templateUrl: '/static/templates/search_fr.html',
            controller: 'SearchController',
        })
        .when('/fr/trigger/', {
            templateUrl: '/static/templates/results_fr.html',
            controller: 'ResController',
        })
        .otherwise({
            redirectTo: "/"
        });
    }
})();
