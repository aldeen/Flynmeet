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
        $scope.addRoute = addRoute;
        $scope.delRoute = delRoute;

        $scope.range = function(number) {
            return new Array(number);
        }
        
        initialize();

        /**
        * @name initialize
        * @desc Actions to be performed when this controller is instantiated
        * @memberOf flynmeet. search_controller.controllers.SearchController
        */
        function initialize() {
            $scope.routes = {}
            var route_format = {origin:'SG', departure_date: new Date(), return_date: new Date()};
            $scope.routes['0'] = route_format ;
            $scope.route_count = 1;
        }
        
        
        /**
        * @name search
        * @desc Send a request to get the cheapesst destination at the given dates
        * @memberOf flynmeet.search_controller.controllers.SearchController
        */
        function search() {
            var search_param = new Array();
            // to replace with the client currency and locale
            search_param.currency = 'SGD';
            search_param.locale = 'SG-sg';
            search_param.routes = {};
            var validity_flag = true;
            var log = [];
            console.log($scope.routes.length)
            if ($scope.routes) {
               for (var i = 0; i <= Object.keys($scope.routes).length; i++) {
                    validity_flag = true;
                    angular.forEach($scope.routes[i], function(val,key){
                        if (!val || val == null || val =="") {
                            validity_flag = validity_flag && false;
                        }
                        else if (key =='return_date' || key=='departure_date') {
                            validity_flag = validity_flag && angular.isDate(val);
                        }
                    }, log);
                    if (validity_flag === true) {
                        search_param.routes[i] = $scope.routes[i];
                    }
                }
                SearchFares.CheapestDests(search_param);
            }
            else {
                $scope.errmsg = 'All fields need to filled';
            }
        }
        
        
        
        /**
        * @name addRoute
        * @desc Add entries to the form so fares for this new route can be fetched. RouteFormInputs
        * requires a model (ref to ng-model) that here is the sting 'routes'
        * @memberOf flynmeet.search_controller.controllers.SearchController
        */
        function addRoute() {
            var route_format = {origin:'SG', departure_date: new Date(), return_date: new Date()};
            $scope.routes[$scope.route_count] = route_format ;
            $scope.route_count ++;
        }
        
        /**
        * @name delRoute
        * @desc del entries to the form for the last route added 
        * @memberOf flynmeet.search_controller.controllers.SearchController
        */
        
        function delRoute() {
            $scope.route_count --;
            delete $scope.routes[$scope.route_count];
        }
        
    }
})();