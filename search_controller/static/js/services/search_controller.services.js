/**
* Search
* @namespace flynmeet.search_controller.services
*/
(function () {
    'use strict';

    angular
        .module('flynmeet.search_controller.services')
        .factory('SearchFares', SearchFares)

    SearchFares.$inject = ['$cookies', '$http', '$location'];

    /**
    * @namespace SearchFares
    * @returns {Factory}
    */
    function SearchFares($cookies, $http, $location) {
        /**
        * @name SearchFares
        * @desc The Factory to be returned
        */
        var search_results = {}
        var SearchFares = {
            CheapestDests: CheapestDests,
            get_search_results: get_search_results,
//           GetOrigins : GetOrigins,
            //cheapestCommonDests: cheapestCommonDests,
            //cheapestFares: cheapestFares,
            //cheapestCommonFares: cheapestCommonFares,
        };
        return SearchFares;
        
//        var get_search_results = get_search_results;
//        var set_search_results = set_search_results;
        
        function get_search_results () {
            return search_results;
        };
            
        function set_search_results (results) {
             search_results = results;
        };

        /**
        * @name CheapestDests
        * @desc Destination is not filled, try to find the cheapest destination for the given dates, from one origin place
        * @param {string} origin The origin place of departure entered by the user
        * @param {date} departure_date The date of the departure entered by the user
        * @param {date} return_date The date of the return flight entered by the user
        * @returns {Promise}
        * @memberOf flynmeet.search_controller.services.SearchFares
        */
        function CheapestDests(params) {
            // Control the input, key must be the following
            var valid_inputkeys = ['currency', 'market', 'routes', 'locale'];
            var return_flag = false
            angular.forEach(params, function (val, key) {
                if (valid_inputkeys.indexOf(key) === -1) {
                    console.error ('Input ' + key + ' parameters is not authorized');
                    return_flag = true;
                    return false;
                }        
            })
            if (return_flag === false) {
                return $http.post('/api/v1/CheapestDests/', params)
                    .then(CheapestDestsSuccessFn, CheapestDestsErrorFn);
            } else {
                return false
            }
            /**
            * @name CheapestDestsSuccessFn
            * @desc Display the results
            */
            function CheapestDestsSuccessFn (data, status, headers, config) {
                set_search_results(data.data);
                console.log(get_search_results());
                $location.path('/buildingyourdreams/');
            }

            /**
            * @name CheapestDestsErrorFn
            * @desc Return to the search engine
            */
            function CheapestDestsErrorFn(data, status, headers, config) {
                console.error('Not possible to search');
            }
        };
        
        
        
         /**
        * @name CheapestDests
        * @desc Destination is not filled, try to find the cheapest destination for the given dates, from one origin place
        * @param {string} origin The origin place of departure entered by the user
        * @param {date} departure_date The date of the departure entered by the user
        * @param {date} return_date The date of the return flight entered by the user
        * @returns {Promise}
        * @memberOf flynmeet.search_controller.services.SearchFares
        */
//        function GetOrigins(input_string) {
//            return $http.post('/api/v1/GetOriginEntries/', {
//                origin: input_string,
//            }).then(GetOriginsSuccessFn, GetOriginsErrorFn);
//
//            /**
//            * @name CheapestDestsSuccessFn
//            * @desc Display the results
//            */
//            function GetOriginsSuccessFn (data, status, headers, config) {
//            }
//
//            /**
//            * @name CheapestDestsErrorFn
//            * @desc Return to the search engine
//            */
//            function GetOriginsErrorFn(data, status, headers, config) {
//                console.error('Not possible to get the origins');
//            }
//        };
    }         
})();