/**
* search_controller controller
* @namespace flynmeet.search_controller.controllers
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
        * @memberOf flynmeet.search_controller.controllers.SearchController
        */
        function initialize() {
        // Set the departure_date at today's date
            $scope.departure_date = new Date();
        }
  
      
        /**
        * @name search
        * @desc Send a request to get the cheapesst destination at the given dates
        * @memberOf flynmeet.search_controller.controllers.SearchController
        */
        function search() {
            SearchFares.CheapestDests($scope.origin, $scope.departure_date, $scope.return_date);
        }
    }
})();