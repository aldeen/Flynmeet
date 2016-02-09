(function () {
    'use strict';

    angular
    .module('flynmeet.config')
    .config(config);

    config.$inject = ['$locationProvider','$interpolateProvider'];

    /**
    * @name config
    * @desc Enable HTML5 routing and change way angular recognize variables
    */
    function config($locationProvider, $interpolateProvider) {
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');
        // To prevent the conflict of `{{` and `}}` symbols
        // between django templating and angular templating we need
        // to use different symbols for angular.
        //$interpolateProvider.startSymbol('{$');
        //  $interpolateProvider.endSymbol('$}');
    }
})();