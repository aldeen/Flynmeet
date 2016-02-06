/**
* Search
* @namespace flynmeet.search_controller.services
*/
(function () {
    'use strict';

    angular
        .module('flynmeet.search_controller.services')
        .factory('SearchFares', SearchFares);

    SearchFares.$inject = ['$cookies', '$http'];

    /**
    * @namespace Authentication
    * @returns {Factory}
    */
    function SearchFares($cookies, $http) {
        /**
        * @name Authentication
        * @desc The Factory to be returned
        */
        var SearchFares = {
            CheapestDests: CheapestDests,
            //cheapestCommonDests: cheapestCommonDests,
            //cheapestFares: cheapestFares,
            //cheapestCommonFares: cheapestCommonFares,
        };
        return SearchFares;

        ////////////////////

        /**
        * @name CheapestDests
        * @desc Destination is not filled, try to find the cheapest destination for the given dates, from one origin place
        * @param {string} origin The origin place of departure entered by the user
        * @param {date} departure_date The date of the departure entered by the user
        * @param {date} return_date The date of the return flight entered by the user
        * @returns {Promise}
        * @memberOf flynmeet.search_controller.services.Search
        */
        function CheapestDests(origin, departure_date, return_date) {
            return $http.post('/api/v1/CheapestDests/', {
                origin: origin,
                departure_date: departure_date,
                return_date: return_date,
            }).then(CheapestDestsSuccessFn, CheapestDestsErrorFn);

            /**
            * @name CheapestDestsSuccessFn
            * @desc Display the results
            */
            function CheapestDestsSuccessFn (data, status, headers, config) {
                //Authentication.login(email, password);
            }

            /**
            * @name CheapestDestsErrorFn
            * @desc Return to the search engine
            */
            function CheapestDestsErrorFn(data, status, headers, config) {
                console.error('Not possible to search');
            }
        };
    }
})();