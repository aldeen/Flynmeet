/**
 * @ngdoc service
 * @name flynmeet.search_controller.services:searchFares
 * @description
 * Manage the communication with the back-end by sending API request and retrieve Quotes results.
 */
(function () {
    'use strict';

    angular
        .module('flynmeet.search_controller.services')
        .factory('searchFares', searchFares)

    searchFares.$inject = ['$cookies', '$http', '$location'];


    /**
     * @ngdoc method
     * @name searchFares
     * @methodOf flynmeet.search_controller.services.searchFares
     * @description
     * Function that instanciates the service
     * 
     * @param   {object} $cookies  
     * @param   {function} $http     HTTP service to send API requests
     * @param   {function} $location 
     * @returns {factory} 
     */
    function searchFares($cookies, $http, $location) {
        var search_results = {};
        var origins = {};

        /**
         * @name searchFares
         * @desc The Factory to be returned
         */
        var searchFares = {
            CheapestDests: CheapestDests,
            get_search_results: get_search_results,
            retrieveOrigins: retrieveOrigins,
            getOrigins: getOrigins,
            //           GetOrigins : GetOrigins,
            //cheapestCommonDests: cheapestCommonDests,
            //cheapestFares: cheapestFares,
            //cheapestCommonFares: cheapestCommonFares,
        };
        return searchFares;


        /**
         * @ngdoc method
         * @name get_search_results
         * @methodOf flynmeet.search_controller.services.searchFares
         * @description
         * Get the search's results
         * 
         */
        function get_search_results() {
            return search_results;
        };

        /**
         * @ngdoc method
         * @name set_search_results
         * @methodOf flynmeet.search_controller.services.searchFares
         * @description
         * Save the search's results returned by the API
         * 
         * @param array results results returned by the HTTP request. They need to be saved.
         */
        function set_search_results(results) {
            search_results = results;
        };

        /**
         * @ngdoc method
         * @name setOrigins
         * @methodOf flynmeet.search_controller.services.searchFares
         * @description
         * set the origin locations that exists, and previously returned by the API.
         * 
         * @param array origins_data list of existing origins returned by the HTTP request.
         */
        function setOrigins(origins_data) {
            origins = origins_data;
        }

        /**
         * @ngdoc method
         * @name getOrigins
         * @methodOf flynmeet.search_controller.services.searchFares
         * @description
         * Get the origin locations that exists, and previously returned by the API
         * 
         */
        function getOrigins() {
            return origins;
        }


        /**
         * @ngdoc method
         * @name CheapestDests
         * @methodOf flynmeet.search_controller.services.searchFares
         * @description
         * Sending a HTTP request in order to find the cheapest destination for the given dates, from one origin place.
         * @param {string} origin The origin place of departure entered by the user
         * @param {date} departure_date The date of the departure entered by the user
         * @param {date} return_date The date of the return flight entered by the user
         * @returns {Promise}
         */
        function CheapestDests(params) {
            // Control the input, key must be the following
            var valid_inputkeys = ['currency', 'market', 'routes', 'locale'];
            var return_flag = false
            angular.forEach(params, function (val, key) {
                if (valid_inputkeys.indexOf(key) == -1) {
                    console.error('Input ' + key + ' parameters is not authorized');
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
             * @ngdoc method
             * @methodOf flynmeet.search_controller.services.searchFares.CheapestDests
             * @name CheapestDestsSuccessFn
             * @desc Display the results
             */
            function CheapestDestsSuccessFn(data, status, headers, config) {

                set_search_results(data.data);
                console.log(get_search_results());
                if ($cookies.getObject('context.locale')['code'] == 'en-GB') {
                    $location.path('en/trigger/');
                } else {
                    $location.path('fr/trigger/');
                }
            }

            /**
             * @ngdoc method
             * @methodOf flynmeet.search_controller.services.searchFares.CheapestDests
             * @name CheapestDestsErrorFn
             * @desc Return to the search engine
             */
            function CheapestDestsErrorFn(data, status, headers, config) {
                console.error('Not possible to search');
            }
        };

        /**
         * @ngdoc method
         * @name retrieveOrigins
         * @methodOf flynmeet.search_controller.services.searchFares
         * @description
         * Sending a HTTP request in order to retrieve Origin Locations that exist based on few letters.
         * 
         * @param {Objet} params that are needed for the function (currency, market, locale, routes). Here Routes must contain only one route with the Input letters being the Origin attribute of that route.
         * @returns {Promise}
         */
        function retrieveOrigins(params) {
            var valid_inputkeys = ['currency', 'market', 'routes', 'locale'];
            var return_flag = false;
            angular.forEach(params, function (val, key) {
                if (valid_inputkeys.indexOf(key) == -1) {
                    console.error('Input ' + key + ' parameters is not authorized');
                    return_flag = true;
                    return false;
                }
            })
            return $http.post('/api/v1/GetOriginEntries/', params).then(retrieveOriginsSuccessFn, retrieveOriginsErrorFn);


            /**
             * @ngdoc method   
             * @methodOf flynmeet.search_controller.services.searchFares.retrieveOrigins
             * @name retrieveOriginsSuccessFn
             * @desc Display the results
             */
            function retrieveOriginsSuccessFn(data, status, headers, config) {
                console.log(data.data.Places);
                setOrigins(data.data.Places);
            }

            /**
             * @ngdoc method   
             * @methodOf flynmeet.search_controller.services.searchFares.retrieveOrigins
             * @name retrieveOriginsErrorFn
             * @desc Return to the search engine
             */
            function retrieveOriginsErrorFn(data, status, headers, config) {
                console.error('Not possible to get the origins');
            }
        };
    }
})();


/**
 * @ngdoc service
 * @name flynmeet.search_controller.services:contextSetter
 * @description
 * Manage cookies in order to save/load session/user data. Requests for Quotes will be done according to that context.
 */
(function () {
    'use strict';

    angular
        .module('flynmeet.search_controller.services')
        .factory('contextSetter', contextSetter)

    contextSetter.$inject = ['$cookies', '$http', '$location', '$filter', '$window'];

    /**
     * @ngdoc method
     * @name contextSetter
     * @methodOf flynmeet.search_controller.services.contextSetter
     * @description
     * Function that instanciates the service.
     * 
     * @param   {object} $cookies  
     * @param   {function} $http     HTTP service to send API requests
     * @param   {function} $location 
     * @param   {function} $filter                               
     * @param   {function} $window Service that manage redirection (and implies the reinstanciations of controllers)              
     * @returns {factory} 
     */
    function contextSetter($cookies, $http, $location, $filter, $window) {
        var locales = {};
        var currencies = {};
        var countries = {};

        var contextSetter = {
            get_locales: get_locales,
            get_countries: get_countries,
            get_currencies: get_currencies,
            GetContext: GetContext,
        };
        return contextSetter;

        /**
         * @ngdoc method   
         * @methodOf flynmeet.search_controller.services.contextSetter
         * @name get_locales
         * @desc get the locales.
         */
        function get_locales() {
            return locales;
        };

        /**
         * @ngdoc method   
         * @methodOf flynmeet.search_controller.services.contextSetter
         * @name set_locales
         * @desc set the locales that have been fetched through HTTP request.
         * 
         * @param object locales_info List of Locales and their respective informations
         */
        function set_locales(locales_info) {
            locales = locales_info;
        };


        /**
         * @ngdoc method   
         * @methodOf flynmeet.search_controller.services.contextSetter
         * @name get_countries
         * @desc get the countries.
         */
        function get_countries() {
            return countries;
        };

        /**
         * @ngdoc method   
         * @methodOf flynmeet.search_controller.services.contextSetter
         * @name set_countries
         * @desc set the countries that have been fetched through HTTP request.
         * 
         * @param object countries_info List of existing Countries that the system supports / detached from the Search engine.
         */
        function set_countries(countries_info) {
            countries = countries_info;
        };

        /**
         * @ngdoc method   
         * @methodOf flynmeet.search_controller.services.contextSetter
         * @name get_currencies
         * @desc get the currencies.
         */
        function get_currencies() {
            return currencies;
        };

        /**
         * @ngdoc method   
         * @methodOf flynmeet.search_controller.services.contextSetter
         * @name set_currencies 
         * @desc set the currencies that have been fetched through HTTP request.
         * 
         * @param object currencies_info List of existing Currencies that the system supports.
         */
        function set_currencies(currencies_info) {
            currencies = currencies_info
        }

        /**
         * @ngdoc method
         * @name filterObjByContaining
         * @methodOf flynmeet.search_controller.services.contextSetter
         * @description
         * Look for a matching value of a given field inside an array of item and return the item corresponding
         * 
         * @param   {object} objtofilter    Reference object in which we will perform the research
         * @param   {string} fieldfilter    Field that will have to be search for in the Reference object
         * @param   {string} subfieldfilter Sub-Field that will have to be search for in the Reference object / not used is null
         * @param   {string} value          Value that the Field or Sub-Field is supposed to have to match.
         * @returns {object} the specific item or nothing if the value of this specific Field/SubField is not matching Value.
         */
        function filterObjByContaining(objtofilter, fieldfilter, subfieldfilter, value) {
            if (objtofilter) {
                return $filter('filter')(objtofilter, function (item) {
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
         * @ngdoc method
         * @name GetContext
         * @methodOf flynmeet.search_controller.services.contextSetter
         * @description
         * Each time the home page will be loaded, this service will have to be called and will load get information from the backend to fill the Input form and research information according to the language that is setup in the context. If no context, this will have to be done according to the page the user is in (/fr/en/... whatever will be supported in the future))
         * @returns {promise}
         */
        function GetContext() {
            // if no cookies - then language based on URL
            if (($location.path()).split('/')[1] && ($location.path()).split('/')[1] == 'fr') {
                if (!$cookies.get('context.locale') || ($cookies.getObject('context.locale')['code'] == 'fr-FR')) {
                    return $http.post('/api/v1/GetContextInfo/', {
                            'locale': 'fr-FR'
                        })
                        .then(GetContextSuccessFn, GetContextErrorFn);
                    // if cookies mais URL differente - relocation to proper URL
                } else {
                    window.location = 'en/exploring/';
                }
                // if url is not fr then we check if cookies
            } else if (!$cookies.get('context.locale') || ($cookies.getObject('context.locale')['code'] == 'en-GB')) {
                return $http.post('/api/v1/GetContextInfo/', {
                        'locale': 'en-GB'
                    })
                    .then(GetContextSuccessFn, GetContextErrorFn);
                // if cookies but URL different, redirection to proper URL 
            } else {
                window.location = 'fr/exploring/';
            }



            /**
             * @ngdoc method
             * @name GetContextSuccessFn
             * @methodOf flynmeet.search_controller.services.contextSetter
             * @description
             * If getting the context information from the backend is successful we can now set the proper context on that side according to the User preferences. Context is saved in the cookie.
             * 
             */
            function GetContextSuccessFn(data, status, headers, config) {
                console.log($cookies.getAll());

                set_currencies(data.data['currencies']);
                set_countries(data.data['countries']);
                set_locales(data.data['locales']);

                // if no cookies - then language based on URL
                if (!$cookies.get('context.locale')) {
                    if (($location.path()).split('/')[1] && ($location.path()).split('/')[1] == 'fr') {
                        $cookies.putObject('context.locale', filterObjByContaining(data.data['locales'], 'code', null, "fr-FR")[0]);
                        $cookies.putObject('context.currency', filterObjByContaining(data.data['currencies'], 'Code', null, "EUR")[0]);
                        $cookies.putObject('context.country', filterObjByContaining(data.data['countries'], 'Code', null, "FR")[0]);
                    } else {
                        $cookies.putObject('context.locale', filterObjByContaining(data.data['locales'], 'code', null, "en-GB")[0]);
                        $cookies.putObject('context.currency', filterObjByContaining(data.data['currencies'], 'Code', null, "SGD")[0]);
                        $cookies.putObject('context.country', filterObjByContaining(data.data['countries'], 'Code', null, "SG")[0]);
                    }
                } // if cookies, we reset cookies based on languages (if Eng was initial, we might need now Fr names for countries) 
                else {
                    var locale = $cookies.getObject('context.locale')
                    var currency = $cookies.getObject('context.currency')
                    var country = $cookies.getObject('context.country')
                    $cookies.putObject('context.locale', filterObjByContaining(data.data['locales'], 'code', null, locale['code'])[0]);
                    $cookies.putObject('context.currency', filterObjByContaining(data.data['currencies'], 'Code', null, currency['Code'])[0]);
                    $cookies.putObject('context.country', filterObjByContaining(data.data['countries'], 'Code', null, country['Code'])[0]);
                }
            }

            /**
             * @ngdoc method
             * @name GetContextSuccessFn
             * @methodOf flynmeet.search_controller.services.contextSetter
             * @description
             * If getting the context information from the backend is not successful we will display a http error.
             * 
             */
            function GetContextErrorFn(data, status, headers, config) {
                // #TODO Gestion d 'erreur
                console.error('Not possible to get the context');
            }
        };
    }
})();