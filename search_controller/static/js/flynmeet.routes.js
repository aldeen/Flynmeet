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
        $routeProvider.when('/index', {
            controller: 'SearchController', 
            templateUrl: '/templates/index.html'
        }).otherwise('/');
    }
})();
