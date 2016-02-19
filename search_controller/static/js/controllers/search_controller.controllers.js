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
        $scope.origin_places = {};
//        $scope.origins = SearchFares.GetOrigins();
//        if (!$scope.origins) {
//            console.log("Origins could not be retrieved");
//            //send to 500 error
//        }
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
            //SearchFares.GetOrigins($scope.routes['0'].origin);

        }
        
        
        /**
        * @name search
        * @desc Send a request to get the cheapesst destination at the given dates
        * @memberOf flynmeet.search_controller.controllers.SearchController
        */
        function search() {
            var search_param = {};
            // to replace with the client currency and locale
            search_param.currency = 'SGD';
            search_param.locale = 'sg-SG';
            search_param.market = 'SG'
            search_param.routes = [];
            var validity_flag = true;
            var log = [];
            if ($scope.routes) {
               for (var i = 0; i < Object.keys($scope.routes).length; i++) {
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
                $scope.search_res = SearchFares.CheapestDests(search_param);       
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



/**
* search_controller controller
* @namespace flynmeet.search_controller.controllers
*/
(function () {
    'use strict';

    angular
        .module('flynmeet.search_controller.controllers')
        .controller('ResController', ResController)
        .filter ('FilterObjByContaining', FilterObjByContaining);

    ResController.$inject = ['$location', '$scope', 'SearchFares', 'SortFares'];
    FilterObjByContaining.$inject =['$filter'];
    /**
    * @namespace ResController
    */
    function ResController($location, $scope, SearchFares, SortFares) {

        $scope.displayResults = displayResults;
        $scope.priority = {'mode':'allroutes'};
        
        $scope.getObjFromRef = function (array, key, value, return_field) {
            for (var i = 0; i < array.length ; i++){
                if (array[i][key] == value) {
                    if (array[i][return_field]) {
                        return array[i][return_field];
                    }
                }
            }    
        }
        
        initialize();

        /**
        * @name initialize
        * @desc Actions to be performed when this controller is instantiated
        * @memberOf flynmeet. search_controller.controllers.ResController
        */
        function initialize() {
            displayResults($scope.priority);
        }
        
        
        function displayResults () {
            SortFares.SortResults ($scope.priority);
            $scope.results = SortFares.get_sorted_results();
        }
        
    }
    
    /**
    * @name FilterObjByContaining
    * @desc Look for a matching value of a given field inside an array of item
    * and return the specific item
    * @memberOf flynmeet. search_controller.controllers.FilterObjByContaining
    */
    function FilterObjByContaining ($filter) {
        var newfilter = function (objtofilter, fieldfilter, value) {
            if (objtofilter) {
                return $filter('filter')(objtofilter, function(item){
                    if (item[fieldfilter] == value) {
                        return item;
                    }
                });
            }
        }
        return newfilter; 
     }
})();