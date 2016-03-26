/**
# CONTROLLERS
Searchcontroller

## Variables:

scope.search_routes 
Contain the different routes entered by the user for the search
the search_routes structure is the following is a object containing different routes with an index as id:
object route = {'origin': string, 'departure_date': datetime, 'return_date': date}
search_route = { 0: object route, 1: object route, ...., n: object route}


Rescontroller

## Variables
scope.search_results
Contain the quotes corresponding to the search of every routes and sorted by destinations
Each object in search results has the following structure:
object res: {'destinationID': integer, 'quotes': {0: object quote, 1: object quote, ..., n: object quote}, 'total_price': integer, 'absence_flag'}

'Absence_flag is a boolean telling if in that result structure, for a same destination, one of the route has no quote. In that case the destination must be invalidated
For object quote, see directly skyscanner. Each quote contains all the quotes + places + carriers + currency

##


/**
* search_controller controller
* @namespace flynmeet.search_controller.controllers
*/
(function () {
    'use strict';

    angular
        .module('flynmeet.search_controller.controllers')
        .controller('SearchController', SearchController);

    SearchController.$inject = ['$location', '$scope', 'SearchFares', '$cookies', '$filter'];

    /**
     * @namespace SearchController
     */
    function SearchController($location, $scope, SearchFares, $cookies, $filter) {

        var init_route_number = 2;
        $scope.search = search;
        $scope.addRoute = addRoute;
        $scope.delRoute = delRoute;
        $scope.origin_places = {};
        $scope.popups_departure_date = {};
        $scope.popups_return_date = {};
        $scope.departuresDateOptions = {};
        $scope.returnsDateOptions = {};
        $scope.search_routes = {};
        $scope.DateOptions = {};
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd/MM/yyyy', 'shortDate'];
        $scope.format = $scope.formats[2];
        $scope.altInputFormats = ['M!/d!/yyyy'];
        $scope.search_routes = [];
        $scope.route_count = 0;
        $scope.noResults = null;
        $scope.autocomplete_origins = {};


        $scope.open_departure_date_p = function (index) {
            $scope.popups_departure_date[index].state = true;
        }
        $scope.open_return_date_p = function (index) {
            $scope.popups_return_date[index].state = true;
        }

        $scope.range = function (number) {
            return new Array(number);
        }

        /**
         * Make sure to adapt the possibilities of the return date according to the departure date
         **/
        $scope.update_return_date = function (index) {
            if ($scope.search_routes[index].departure_date) {
                if (!$scope.search_routes[index].return_date) {
                    $scope.search_routes[index].return_date = $scope.search_routes[index].departure_date;
                    $scope.DateOptions[index].return.minDate = new Date();
                } else if ($scope.search_routes[index].departure_date.getTime() > $scope.search_routes[index].return_date.getTime()) {
                    $scope.search_routes[index].return_date = $scope.search_routes[index].departure_date;
                    $scope.DateOptions[index].return.minDate = $scope.search_routes[index].departure_date;
                } else {
                    $scope.DateOptions[index].return.minDate = $scope.search_routes[index].departure_date;
                }
            } else {
                $scope.DateOptions[index].return.minDate = new Date();
            }
        }

        $scope.getOrigins = function (inputText, index) {
            var search_params = {};
            console.log(index);
            $scope.autocomplete_origins[index].loading_departures = true;
            // if the new value doesn not exist inside the old one, or the old one does not exist in the new one
            // we proceed with new researche
            if ((inputText.indexOf($scope.autocomplete_origins[index]['past_input']) == -1) && ($scope.autocomplete_origins[index]['past_input'].indexOf(inputText) == -1) || ($scope.autocomplete_origins[index]['past_input']) == '') {
                // to replace with the client currency and locale
                if ($cookies.get('context.currency') && $cookies.get('context.locale') && $cookies.get('context.country')) {
                    search_params.currency = $cookies.getObject('context.currency')['Code'];
                    search_params.locale = $cookies.getObject('context.locale')['code'];
                    search_params.market = $cookies.getObject('context.country')['Code'];
                }
                search_params.routes = [];
                search_params.routes.push({
                    'origin': inputText,
                });
                SearchFares.retrieveOrigins(search_params).then(function (response) {
                        var results = [];
                        var tempValue = {};
                        angular.forEach(SearchFares.getOrigins(), function (value) {
                            tempValue = value;
                            tempValue.display = value.PlaceName + ' (' + (value.PlaceId).replace('-sky', '') + ')' + ', ' + value.CountryName;
                            results.push(tempValue);
                        })
                        $scope.autocomplete_origins[index]['past_results'] = results;
                        $scope.autocomplete_origins[index]['past_input'] = inputText;
                        $scope.autocomplete_origins[index].loading_departures = false;
                        console.log(results);
                        return results;
                    })
                    // else we use the old research results and filter it again.
            } else {
                //filter sur past_results
                var results = $filter('filter')($scope.autocomplete_origins[index]['past_results'], function (value) {
                    console.log(value);
                    if (angular.lowercase(value.PlaceName).indexOf(angular.lowercase(inputText)) != -1) {
                        return true;
                    }
                });
                $scope.autocomplete_origins[index]['past_input'] = inputText;
                $scope.autocomplete_origins[index].loading_departures = false;
                console.log(results);
                return results;
            }
        };

        initialize();

        /**
         * @name initialize
         * @desc Actions to be performed when this controller is instantiated
         * @memberOf flynmeet. search_controller.controllers.SearchController
         */
        function initialize() {
            // In here we initialize the form for the first route/destination
            // If data in cookies, load last research data
            if ($cookies.get('searches')) {
                var searches = $cookies.getObject('searches');
                if (searches[searches.length - 1]['routes'].length != 0) {
                    var routes = searches[searches.length - 1]['routes'];
                    for (var i = 0; i < routes.length; i++) {
                        // making sure the date is not in the past, if so date are today's date
                        var departure_date = new Date(routes[i].departure_date);
                        var return_date = new Date(routes[i].return_date);
                        if (departure_date.getTime() < (new Date().getTime())) {
                            departure_date = new Date();
                        }
                        if (return_date.getTime() < (new Date().getTime())) {
                            return_date = new Date();
                        }
                        add_route_format(i, {
                            origin: routes[i].origin,
                            departure_date: departure_date,
                            return_date: return_date,
                        });
                    }
                    return true;
                }
            }
            for (var i = 0; i < init_route_number; i++) {
                add_route_format(i, {
                    origin: '',
                    departure_date: new Date(),
                    return_date: new Date()
                });
            }
        }


        /**
         * @name add_route_input
         * @desc add a new input for route into a form
         * @route_format
         * @memberOf flynmeet.search_controller.controllers.SearchController
         */
        function add_route_format(index, route_format) {
            // default mode - today's date,
            $scope.search_routes[index] = route_format;
            $scope.autocomplete_origins[index] = {
                input_name: "",
                error_message: "",
                past_input: "",
                past_results: "",
                loading_departures: false
            };
            $scope.autocomplete_origins[index].input_name = 'typeahead_origin' + index.toString();
            $scope.DateOptions[index] = {
                departure: {
                    formatYear: 'yy',
                    maxDate: new Date(2020, 5, 22),
                    minDate: new Date(),
                    startingDay: 1,
                },
                return: {
                    formatYear: 'yy',
                    maxDate: new Date(2020, 5, 22),
                    minDate: new Date(),
                    startingDay: 1,
                },
            }
            $scope.popups_departure_date[index] = {
                state: false,
            };
            $scope.popups_return_date[index] = {
                state: false,
            };
            $scope.route_count++;
            // cookies mode
        }
        /**
         * @name save_search_info
         * @desc Save search informations in cookies
         * @memberOf flynmeet.search_controller.controllers.SearchController
         */
        // must be saved:
        // route
        // context
        // date of search
        function save_search_info(routes, context) {
            // if maximum number of searches reached, remove the oldest one
            if ($cookies.get('searches')) {
                var searches = $cookies.getObject('searches');
                if (searches.length >= 5) {
                    searches.splice(0);
                }
            } else {
                var searches = [];
            }
            searches.push({
                routes: routes,
                context: context
            });
            $cookies.putObject('searches', searches);
        }

        /**
         * @name search
         * @desc Send a request to get the cheapest destination at the given dates
         * @memberOf flynmeet.search_controller.controllers.SearchController
         */
        function search() {
            var search_params = {};
            // to replace with the client currency and locale
            if ($cookies.get('context.currency') && $cookies.get('context.locale') && $cookies.get('context.country')) {
                search_params.currency = $cookies.getObject('context.currency')['Code'];
                search_params.locale = $cookies.getObject('context.locale')['code'];
                search_params.market = $cookies.getObject('context.country')['Code'];
            }
            search_params.routes = [];
            var validity_flag = true;
            var log = [];
            if ($scope.search_routes) {
                for (var i = 0; i < Object.keys($scope.search_routes).length; i++) {
                    validity_flag = true;
                    angular.forEach($scope.search_routes[i], function (val, key) {
                        if (!val || val == null || val == "") {
                            validity_flag = validity_flag && false;
                        } else if (key == 'return_date' || key == 'departure_date') {
                            validity_flag = validity_flag && angular.isDate(val);
                        }
                    }, log);
                    if (validity_flag === true) {
                        search_params.routes[i] = $scope.search_routes[i];
                    }
                }
                save_search_info(search_params.routes, {
                    currency: search_params.currency,
                    locale: search_params.locale,
                    market: search_params.market,
                });
                $scope.search_res = SearchFares.CheapestDests(search_params);
            } else {
                $scope.errmsg = 'All fields need to filled';
            }
        }



        /**
         * @name addRoute
         * @desc Add entries to the form so fares for this new route can be fetched. RouteFormInputs
         * requires a model (ref to ng-model) that here is the string 'routes'
         * @memberOf flynmeet.search_controller.controllers.SearchController
         */
        function addRoute() {
            add_route_format($scope.route_count, {
                origin: '',
                departure_date: new Date(),
                return_date: new Date()
            });
        }

        /**
         * @name delRoute
         * @desc del entries to the form for the last route added 
         * @memberOf flynmeet.search_controller.controllers.SearchController
         */

        function delRoute() {
            $scope.route_count--;
            delete $scope.search_routes[$scope.route_count];
            delete $scope.popups_departure_date[$scope.route_count];
            delete $scope.popups_return_date[$scope.route_count];
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

    ResController.$inject = ['$location', '$scope', 'SearchFares', '$filter', '$cookies'];
    /**
     * @namespace ResController
     */
    function ResController($location, $scope, SearchFares, $filter, $cookies) {

        $scope.currency = $cookies.getObject('context.currency');
        $scope.locale = $cookies.getObject('context.locale');
        $scope.country = $cookies.getObject('context.country');
        $scope.search_results = {};
        $scope.priority = {
            'mode': 'allroutes'
        };

        $scope.getObjFromRef = function (array, key, value, return_field) {
            for (var i = 0; i < array.length; i++) {
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


        function displayResults() {
            var results = SearchFares.get_search_results();
            SortResults($scope.priority, results);
        }

        /**
         * @name SortResults
         * @desc Process and compare the results to return an array of routes according to
         * the mode of priority that has been set
         * @param priority Set the priority type for sorting ('allroutes', 'Route')
         * @memberOf flynmeet.search_controller.controllers.Searchcontroller
         */
        function SortResults(priority, res) {
            if (priority['mode']) {
                if (priority['mode'] == 'allroutes') {
                    // Process with sorting with a common cheapest destination
                    var obj = [];
                    if (Object.keys(res).length == 1) {
                        for (var i = 0; i < Object.keys(res[0].Quotes).length; i++) {
                            obj[i] = formatThatForMe(i, res);
                        }
                    } else {
                        obj = AdvancedSorting(0, new Array(), res);
                    }
                    console.log(obj);
                    $scope.search_results = obj;
                } else if (priority['mode'] == 'route') {}
                // check priority number
                // then process accordingly
            }
        }


        /**
         * @name AdvancedSorting
         * @desc Recursive function sorting the different quotes for each destination, 
         * from the cheapest to the more expensive
         * @param index is the cursor position in the reference table/object
         * @param new_obj is the object that is create in each function iteration then 
         * transfered to the next     iteration
         * @param ref_obj is the reference table/object
         * @memberOf flynmeet.search_controller.controllers.Searchcontroller
         */
        function AdvancedSorting(index, new_obj, ref_obj) {
            var obj = [];
            // Checking whether the end is reached
            if (index >= ref_obj[0]['Quotes'].length) {
                return new_obj;
            }
            // Make sure that the results is not empty
            if (ref_obj[0]['Quotes'] == '[]') {
                //TODO raise exception -> no results + user page
                return false;
            }
            // if it is the first object that we are comparing
            // then we put the first object of ref_obj in the new object
            if (Object.keys(new_obj).length == 0) {
                // get all the quotes for all routes for this destination as an obj
                new_obj[index] = formatThatForMe(index, ref_obj);
                index = index + 1;
            }
            // then we are sorting with new ref item. If smaller, before, higher, after
            for (var i = 0; i < Object.keys(new_obj).length; i++) {
                var struct = formatThatForMe(index, ref_obj);
                if (struct.total_price <= new_obj[i].total_price) {
                    // case were item in ref is smaller than actual -> insert
                    for (var j = i; j < Object.keys(new_obj).length; j++) {
                        // shift all the items of 1 offset
                        obj[j + 1] = new_obj[j];
                    }
                    // insert the object in between
                    obj[i] = struct;
                    break;
                } else if (i == Object.keys(new_obj).length - 1) {
                    // if we are at the end of the table, insert the item
                    obj[i + 1] = struct;
                }
                //  we keep copying the actual into the new
                obj[i] = new_obj[i];
            }
            $scope.search_results = obj;
            return AdvancedSorting(index + 1, obj, ref_obj);
        };

        /**
         *  formatThatForMe
         * 
         */
        function formatThatForMe(index, ref_obj) {
            // we expect to receive input of quotes as the following
            // {'0': {'quotes': [{quoteId,minPrice,...}, {quoteId,minPrice,...}, {quoteId,minPrice,...} ], 'places': [{..}, {..}]},
            // {'1': {'quotes': [{quoteId,minPrice,...}, {quoteId,minPrice,...}, {quoteId,minPrice,...} ], 'places': [{..}, {..}]},,
            // {'2': {'quotes': [{quoteId,minPrice,...}, {quoteId,minPrice,...}, {quoteId,minPrice,...} ], 'places': [{..}, {..}]},
            // }
            if (Object.keys(ref_obj[0].Quotes) != 0) {
                var destination_id = ref_obj[0]['Quotes'][index].OutboundLeg.DestinationId;
                var new_obj = {}
                new_obj['DestinationId'] = destination_id
                new_obj['dest_quotes'] = {
                    '0': ref_obj[0]['Quotes'][index]
                };
                new_obj['total_price'] = ref_obj[0]['Quotes'][index].MinPrice;
                new_obj['places'] = ref_obj[0]['Places'];
                new_obj['absence_flag'] = false;
                for (var i = 1; i < Object.keys(ref_obj).length; i++) {
                    var quote = filterObjByContaining(ref_obj[i]['Quotes'], 'OutboundLeg', 'DestinationId', destination_id);
                    if (!quote) {
                        new_obj['dest_quotes'][i] = null;
                        new_obj['absence_flag'] = true;
                    } else {
                        new_obj['dest_quotes'][i] = quote[0];
                        new_obj['places'][i] = ref_obj[i]['Places']
                        new_obj['total_price'] += quote[0].MinPrice;
                    }
                }
                return new_obj;
            } else {
                return false;
            }
        };

        /**
         * @name FilterObjByContaining
         * @desc Look for a matching value of a given field inside an array of item
         * and return the specific item
         * @memberOf flynmeet. search_controller.controllers.FilterObjByContaining
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
    } // end Rescontroller function
})();




/**
 * search_controller controller
 * @namespace flynmeet.search_controller.controllers
 */
(function () {
    'use strict';

    angular
        .module('flynmeet.search_controller.controllers')
        .controller('ContextController', ContextController)

    ContextController.$inject = ['$location', '$scope', '$uibModal', '$log', 'ContextSetter', '$cookies'];


    /**
     * @namespace ContextController
     */
    function ContextController($location, $scope, $uibModal, $log, ContextSetter, $cookies) {

        ContextSetter.GetContext();

        if ($cookies.get('context.currency') && $cookies.get('context.locale') && $cookies.get('context.country')) {
            $scope.currency = $cookies.getObject('context.currency');
            $scope.country = $cookies.getObject('context.country');
            $scope.locale = $cookies.getObject('context.locale');
        }

        $scope.open = function (size) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'context_box.html',
                controller: 'ContextBoxInstanceCtrl',
                size: size,
            });
            modalInstance.result.then(function () {
                ContextSetter.GetContext();
                location_management();
                $scope.currency = $cookies.getObject('context.currency');
                $scope.country = $cookies.getObject('context.country');
                $scope.locale = $cookies.getObject('context.locale');
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        function relocate(url, pref_language) {
            if (($location.path() == '/en/trigger') || ($location.path() == '/fr/trigger')) {
                $location.path('/' + pref_language + '/exploring');
            } else {
                var split_url = url.split('/');
                if (split_url[1]) {
                    split_url[1] = pref_language;
                    return split_url.join('/');
                } else {
                    return '500_URL';
                }
            }
        }

        function location_management() {
            if (!angular.equals($scope.locale, $cookies.getObject('context.locale'))) {
                if ($cookies.getObject('context.locale')['code'] == 'en-GB') {}
                $location.path(relocate($location.path(), 'en'));
            } else {
                $location.path(relocate($location.path(), 'fr'));
            }
        }
    } // end Contextcontroller function
})();

// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.


/**
 * search_controller controller
 * @namespace flynmeet.search_controller.controllers
 */
(function () {
    'use strict';

    angular
        .module('flynmeet.search_controller.controllers')
        .controller('ContextBoxInstanceCtrl', ContextBoxInstanceCtrl)

    ContextBoxInstanceCtrl.$inject = ['$scope', '$uibModalInstance', 'ContextSetter', '$filter', '$cookies'];
    /**
     * @namespace ContextBoxInstanceCtrl
     */
    function ContextBoxInstanceCtrl($scope, $uibModalInstance, ContextSetter, $filter, $cookies) {

        $scope.locales = ContextSetter.get_locales();
        $scope.countries = ContextSetter.get_countries();
        $scope.currencies = ContextSetter.get_currencies();
        $scope.locale = {};
        $scope.country = {};
        $scope.currency = {};

        if ($cookies.get('context.currency') && $cookies.get('context.locale') && $cookies.get('context.country')) {
            var currency = $cookies.getObject('context.currency');
            var locale = $cookies.getObject('context.locale');
            var country = $cookies.getObject('context.country');
            $scope.locale = filterObjByContaining($scope.locales, 'name', null, locale['name'])[0];
            $scope.country = filterObjByContaining($scope.countries, 'Code', null, country['Code'])[0];
            $scope.currency = filterObjByContaining($scope.currencies, 'Code', null, currency['Code'])[0];
        } else {
            $uibModalInstance.dismiss('Internal error, no user data saved in cookies');
        }

        //        $scope.locale = filterObjByContaining  ($scope.locales, 'name', null , "English (United Kingdom)")[0];
        //        $scope.country = filterObjByContaining  ($scope.countries, 'Code', null , "SG")[0];
        //        $scope.currency = filterObjByContaining  ($scope.currencies, 'Code', null , "SGD")[0];

        $scope.ok = function () {
            //save new data into cookies
            $cookies.putObject('context.locale', $scope.locale);
            $cookies.putObject('context.currency', $scope.currency);
            $cookies.putObject('context.country', $scope.country);
            $uibModalInstance.close(true);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };


        /**
         * @name FilterObjByContaining
         * @desc Look for a matching value of a given field inside an array of item
         * and return the specific item
         * @memberOf flynmeet. search_controller.controllers.FilterObjByContaining
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
    }
})();
