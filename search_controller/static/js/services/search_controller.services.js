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
        var search_results = {}
        /**
        * @name SearchFares
        * @desc The Factory to be returned
        */
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
                if ($cookies.getObject('context.locale')['code'] == 'en-GB') {
                    $location.path('en/trigger/');
                } else {
                    $location.path('fr/trigger/');
                }
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
    
    angular
        .module('flynmeet.search_controller.services')
        .factory('ContextSetter', ContextSetter)

    ContextSetter.$inject = ['$cookies', '$http', '$location', '$filter'];

    /**
    * @namespace ContextSetter
    * @returns {Factory}
    */
    function ContextSetter($cookies, $http, $location, $filter) {
        var locales = {};
        var currencies = {};
        var countries = {};
        /**
        * @name ContextSetter
        * @desc The Factory to be returned
        */

        var ContextSetter = {
            get_locales: get_locales,
            get_countries: get_countries,
            get_currencies: get_currencies,
            GetContext: GetContext,
        };
        return ContextSetter;
        
        function get_locales () {
            return locales;
        };
            
        function set_locales (locales_info) {
             locales = locales_info;
        };
        
        function get_countries () {
            return countries;
        };
            
        function set_countries (countries_info) {
             countries = countries_info;
        };
        
        function get_currencies () {
            return currencies;
        };
        function set_currencies (currencies_info) {
            currencies = currencies_info
        }
        
        /**
        * @name FilterObjByContaining
        * @desc Look for a matching value of a given field inside an array of item
        * and return the specific item
        * @memberOf flynmeet. search_controller.controllers.FilterObjByContaining
        */

        function filterObjByContaining  (objtofilter, fieldfilter, subfieldfilter, value) {
            if (objtofilter) {
                return $filter('filter')(objtofilter, function(item){
                    if (item[fieldfilter] == value) {
                        return item;
                    }
                    if (subfieldfilter) {
                        if (item[fieldfilter][subfieldfilter] == value) {
                            return item;
                        }
                    }
                })
            }
        }    

        
        /**
        * @name GetContext
        * @desc Get possible context from the backend
        * @returns {Promise}
        * @memberOf flynmeet.search_controller.services.ContextSetter
        */
        function GetContext() { 
            // if no cookies - then language based on URL
            if (!$cookies.get('context.locale')) {
                if (($location.path()).split('/')[1] && ($location.path()).split('/')[1] == 'fr') {
                    return $http.post('/api/v1/GetContextInfo/', {'locale': 'fr-FR'})
                        .then(GetContextSuccessFn, GetContextErrorFn); 
                } else {
                    return $http.post('/api/v1/GetContextInfo/', {'locale': 'en-GB'})
                        .then(GetContextSuccessFn, GetContextErrorFn); 
                }
            // if cookies, languages based on cookies
            }else {
                return $http.post('/api/v1/GetContextInfo/', {'locale': $cookies.getObject('context.locale')['code']})
                        .then(GetContextSuccessFn, GetContextErrorFn); 
            }
            
            /**
            * @name GetContextSuccessFn
            * @desc Display the results
            */
            function GetContextSuccessFn (data, status, headers, config) {
                console.log (config)
                set_currencies(data.data['currencies']);
                set_countries(data.data['countries']);
                set_locales(data.data['locales']);
                
                // if no cookies - then language based on URL
                if (!$cookies.get('context.locale')) {
                    if (($location.path()).split('/')[1] && ($location.path()).split('/')[1] == 'fr') {
                        $cookies.putObject('context.locale', filterObjByContaining(data.data['locales'], 'code', null , "fr-FR")[0]);
                        $cookies.putObject('context.currency', filterObjByContaining(data.data['currencies'], 'Code', null , "EUR")[0]);
                        $cookies.putObject('context.country', filterObjByContaining(data.data['countries'], 'Code', null , "FR")[0]);
                    } else {
                        $cookies.putObject('context.locale', filterObjByContaining(data.data['locales'], 'code', null , "en-GB")[0]);
                        $cookies.putObject('context.currency', filterObjByContaining(data.data['currencies'], 'Code', null , "SGD")[0]);
                        $cookies.putObject('context.country', filterObjByContaining(data.data['countries'], 'Code', null , "SG")[0]);
                    }
                } // if cookies, we reset cookies based on languages (if Eng was initial, we might need now Fr names for countries) 
                else {
                    var locale = $cookies.getObject('context.locale')
                    var currency = $cookies.getObject('context.currency')
                    var country = $cookies.getObject('context.country')
                    $cookies.putObject('context.locale', filterObjByContaining(data.data['locales'], 'code', null , locale['code'])[0]);
                    $cookies.putObject('context.currency', filterObjByContaining(data.data['currencies'], 'Code', null , currency['Code'])[0]);
                    $cookies.putObject('context.country', filterObjByContaining(data.data['countries'], 'Code', null , country['Code'])[0]);
                }
            }

            /**
            * @name GetContextErrorFn
            * @desc Return to the search engine
            */
            function GetContextErrorFn(data, status, headers, config) {
                console.error('Not possible to get the context');
            }
         };
    }
})();