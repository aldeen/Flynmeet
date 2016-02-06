/**
* Search controller
* @namespace Flynmeet.search_controller.controllers
*/
(function () {
    'use strict';

    angular
        .module('flynmeet.search_controller.controllers')
        .controller('SearchController', SearchController);

    SearchController.$inject = ['$location', '$scope', 'SearchFares'];

    /**
    * @namespace SearchController
    */
    function SearchController($location, $scope, SearchFares) {

        $scope.search = search;

        initialize();

        /**
        * @name initialize
        * @desc Actions to be performed when this controller is instantiated
        * @memberOf Flynmeet.search_controller.controllers.SearchController
        */
        function initialize() {
        // Set the departure_date at today's date
            $scope.departure_date = new Date();
        // Set client's origin departure according to location
        //    if (Authentication.isAuthenticated()) {
        //        $location.url('/');   
        //    }
        }
  
      
        /**
        * @name login
        * @desc log a user in
        * @memberOf thinkster.authentication.controllers.LoginController
        */
        function search() {
            // TO BE FILLED PROPERLY AND DYNAMICALLY
            SearchFares.CheapestDests($scope.origin, $scope.departure_date, $scope.return_date);
        }
    }
})();