/**
# CONTROLLERS
Searchcontroller

## Variables:

OBJECT origin =  
    ** Matches de Departure/Arrival places defined. For now the structure follows Skyscanner's one
    origin = {
        PlaceID : 'string',
        PlaceName: 'string',
        CountryId: 'string',
        RegionId: 'string',
        CityId: 'string',
        CountryName: 'string', 
    }
    
OBJECT route
    ** Contains the information of only one Route
    route = {
        'origin': STRING,
        'departure_date': DATETIME,
        'return_date': DATETIME
    }
    
OBJECT search_route (attached to DOM with Scope.search_routes)
    ** Contain the different routes entered by the user for the search
    ** the search_routes structure is the following is a object containing different routes with an index as id:
    search_route = { 
        0: OBJECT route,    
        1: OBJECT route, 
        ...., 
        n: OBJECT route,
    }

OBJECT autocomplete_origins
    ** Contains information about departure HBOOTSTRAP UI TYPEAHEAD INPUT to set.
    autocomplete_origins = {
        input_name: STRING,
        error_message: STRING,
        past_input: STRING,
        past_results: ARRAY/OBJECT,
        loading_departures: BOOLEAN,
        noResults: BOOLEAN,
        non_formatted_origin: STRING, 
    }

OBJECT return_datepickers / date_datepickers
    ** Contains information about return/departure BOOTSTRAP UI DATEPICKER INPUT to set 
        dateOptions: OBJECT (see bootstrap ui),
        popups: {
            state: BOOLEAN,
        },
        error_message: STRING,
        pattern: STRING,


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
 * @ngdoc controller
 * @name flynmeet.search_controller.controllers:SearchController
 * @description
 * Controle the search page with dynamic addition of Routes.
 */
(function () {
    'use strict';

    angular
        .module('flynmeet.search_controller.controllers')
        .controller('SearchController', SearchController);

    SearchController.$inject = ['$location', '$scope', 'searchFares', '$cookies', '$filter'];

    /**
     * @ngdoc method
     * @name SearchController
     * @methodOf flynmeet.search_controller.controllers.SearchController
     * @description
     * Function that instanciate the controller
     *
     * @param   {object}         $location   
     * @param   {object}         $scope      
     * @param   {function}       searchFares  Service that allows to retrieve information from the backend based on user inputs
     * @param   {object}         $cookies   
     * @param   {function}       $filter 
     * @returns {} 
     */
    function SearchController($location, $scope, searchFares, $cookies, $filter) {

        var init_route_number = 2;
        $scope.search = search;
        $scope.addRoute = addRoute;
        $scope.delRoute = delRoute;
        $scope.origin_places = {};
        $scope.departure_datepickers = {};
        $scope.return_datepickers = {};
        $scope.search_routes = {};
        $scope.DateOptions = {};
        $scope.date_formatting_options = [
            {
                format: 'dd-MMMM-yyyy',
                pattern: '^(\d{2)-(\d{4})-(\d{4})$',
            }, {
                format: 'yyyy/MM/dd',
                pattern: '^(\d{4})\/(\d{2})\/(\d{2})$',
            }, {
                format: 'dd/MM/yyyy',
                pattern: '^(\d{2})\/(\d{2})\/(\d{4})$',
            }, {
                format: 'shortDate',
                pattern: '/^\d{1,2}\/\d{1,2}\/((\d{2})|(\d{4}))$/',
            }
        ];
        $scope.date_format = $scope.date_formatting_options[2]['format'];
        $scope.date_pattern = $scope.date_formatting_options[2]['pattern'];
        $scope.pattern = "^(\d{2})\/(\d{2})\/(\d{4})$";
        $scope.search_routes = [];
        $scope.route_count = 0;
        $scope.noResults = false;
        $scope.autocomplete_origins = {};
        $scope.update_return_date = update_return_date;
        $scope.getOrigins = getOrigins;
        $scope.format_ngModel = format_ngModel;
        $scope.open_departure_date_p = function (index) {
            $scope.departure_datepickers[index].popups.state = true;
        }
        $scope.open_return_date_p = function (index) {
            $scope.return_datepickers[index].popups.state = true;
        }

        $scope.range = function (number) {
            return new Array(number);
        }

        $scope.checkResults = function (index) {
            if ($scope.noResults == true && $scope.autocomplete_origins[index].noResults == true) {
                return true;
            } else {
                return false;
            }

        };
        initialize();


        /**
         * @ngdoc method
         * @name format_ngModel
         * @methodOf flynmeet.search_controller.controllers.SearchController
         * @description
         * Bind an object to the model. This objects matches the initial value of Model
         *
         * @param   {number} index represents the cursor in the route table, so we know which route has to be proceeded.
         * @param   {string} model Model which will allow us to identify the object to bind
         * @returns {string}   return the initial value of Model
         */
        function format_ngModel(index, model) {
            // write a try/catch here
            var results = $scope.autocomplete_origins[index]['past_results'];
            for (var i = 0; i < results.length; i++) {
                if (model === results[i].display) {
                    $scope.search_routes[index].origin = results[i];
                    return results[i].display;
                }
                return "Error";
            }
        }


        //         $scope.validate_date = function (index) {
        //            // $scope.update_return_date()
        //        }



        /**
         * @ngdoc method
         * @name update_return_date
         * @methodOf flynmeet.search_controller.controllers.SearchController
         * @description
         * Make sure to adapt the possibilities to pick up the return date according to the departure date in the datepicker
         *
         * @param {number} represents the cursor in the route table, so we know which route has to be proceeded.    
         */
        function update_return_date(index) {
            if ($scope.search_routes[index].departure_date) {
                if (!$scope.search_routes[index].return_date) {
                    $scope.search_routes[index].return_date = $scope.search_routes[index].departure_date;
                    $scope.return_datepickers[index].dateOptions.minDate = new Date();
                } else if ($scope.search_routes[index].departure_date.getTime() > $scope.search_routes[index].return_date.getTime()) {
                    $scope.search_routes[index].return_date = $scope.search_routes[index].departure_date;
                    $scope.return_datepickers[index].dateOptions.minDate = $scope.search_routes[index].departure_date;
                } else {
                    $scope.return_datepickers[index].dateOptions.minDate = $scope.search_routes[index].departure_date;
                }
            } else {
                $scope.return_datepickers[index].dateOptions.minDate = new Date();
            }
        }


        /**
         * @ngdoc method
         * @name getOrigins
         * @methodOf flynmeet.search_controller.controllers.SearchController
         * @description
         * Launch a service that will get autossuggestion of location based on User input
         *
         * @param   {string}   inputText Input text typed by the user
         * @param   {number}   index represents the cursor in the route table, so we know which route has to be proceeded.    
         * @returns {Array} Array of origin location returned by the autosuggestion service.    
         */
        function getOrigins(inputText, index) {
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
                searchFares.retrieveOrigins(search_params).then(function (response) {
                        var results = [];
                        var tempValue = {};
                        angular.forEach(searchFares.getOrigins(), function (value) {
                            tempValue = value;
                            tempValue.display = value.PlaceName + ' (' + (value.PlaceId).replace('-sky', '') + ')' + ', ' + value.CountryName;
                            results.push(tempValue);
                        })
                        $scope.autocomplete_origins[index]['past_results'] = results;
                        $scope.autocomplete_origins[index]['past_input'] = inputText;
                        $scope.autocomplete_origins[index].loading_departures = false;
                        console.log(results);
                        if (results.length == 0) {
                            $scope.autocomplete_origins[index].noResults = true;
                        }
                        return results;
                    })
                    // else we use the old research results and filter it again.
            } else {
                //filter sur past_results
                //                var results = $filter('filter')($scope.autocomplete_origins[index]['past_results'], function (value) {
                //                    console.log(value);
                //                    if (angular.lowercase(value.PlaceName).indexOf(angular.lowercase(inputText)) != -1) {
                //                        return true;
                //                    }
                //                });
                $scope.autocomplete_origins[index]['past_input'] = inputText;
                $scope.autocomplete_origins[index].loading_departures = false;
                //                if (results.length == 0) {
                //                    $scope.autocomplete_origins[index].noResults = true;
                //                }
                return $scope.autocomplete_origins[index]['past_results'];
                //                return results;
            }
        };


        /**
         * @ngdoc method
         * @name initialize
         * @methodOf flynmeet.search_controller.controllers.SearchController
         * @description
         * Actions to be performed when this controller is instantiated
         *
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
                            departure_date = new Date() + 1;
                        }
                        if (return_date.getTime() < (new Date().getTime())) {
                            return_date = new Date();
                        }
                        add_route_format(i, {
                            origin: routes[i].origin.display,
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
         * @ngdoc method
         * @name add_route_input
         * @methodOf flynmeet.search_controller.controllers.SearchController
         * @description
         * Add and Initialise new route variables and HTML data input route into the HTML form
         * @param {number} index represents the cursor in the route table, so we know which route has to be proceeded.
         * @param {object} route_format is an initialized route object
         */
        function add_route_format(index, route_format) {
            // default mode - today's date,
            $scope.search_routes[index] = route_format;
            $scope.autocomplete_origins[index] = {
                input_name: "",
                error_message: "",
                past_input: "",
                past_results: "",
                loading_departures: false,
                noResults: false,
                non_formatted_origin: "",
            };
            $scope.autocomplete_origins[index].input_name = 'typeahead_origin' + index.toString();
            $scope.departure_datepickers[index] = {
                dateOptions: {
                    formatYear: 'yy',
                    maxDate: new Date(2020, 5, 22),
                    minDate: new Date(),
                    startingDay: 1
                },
                popups: {
                    state: false,
                },
                error_message: '',
                pattern: $scope.pattern,
                name: 'departure_' + index.toString(),
            }
            $scope.return_datepickers[index] = {
                dateOptions: {
                    formatYear: 'yy',
                    maxDate: new Date(2020, 5, 22),
                    minDate: new Date(),
                    startingDay: 1,
                },
                popups: {
                    state: false,
                },
                error_message: '',
                pattern: $scope.pattern,
                name: 'return_' + index.toString(),
            };
            $scope.route_count++;
        }



        /**
         * @ngdoc method
         * @name save_search_info
         * @methodOf flynmeet.search_controller.controllers.SearchController
         * @description
         * Save search informations in cookies
         * @param {object} routes routes that will have to be saved into the cookie
         * @param {object} context current context associated to the routes
         */
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
         * @ngdoc method
         * @name search
         * @methodOf flynmeet.search_controller.controllers.SearchController
         * @description
         * Call the service that will get the cheapest destination at the given dates
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
            var routes = [];
            //            var validity_flag = true;
            if ($scope.search_routes) {
                for (var i = 0; i < Object.keys($scope.search_routes).length; i++) {
                    routes[i] = $scope.search_routes[i];
                    routes[i].origin = $scope.search_routes[i].origin.PlaceId.replace('-sky', '')
                        //                    validity_flag = true;
                        //                    angular.forEach($scope.search_routes[i], function (val, key) {
                        //                        if (!val || val == null || val == "") {
                        //                            validity_flag = validity_flag && false;
                        //                        } else if (key == 'return_date' || key == 'departure_date') {
                        //                            validity_flag = validity_flag && angular.isDate(val);
                        //                        }
                        //                    }, log);
                        //                    if (validity_flag === true) {
                        //                        search_params.routes[i] = $scope.search_routes[i];
                        //                    }
                }
                save_search_info(search_params.routes, {
                    currency: search_params.currency,
                    locale: search_params.locale,
                    market: search_params.market,
                });
                search_params.routes = routes;
                $scope.search_res = searchFares.CheapestDests(search_params);
            } else {
                $scope.errmsg = 'All fields need to filled';
            }
        }



        /**
         * @ngdoc method
         * @name addRoute
         * @methodOf flynmeet.search_controller.controllers.SearchController
         * @description
         * Add entries to the form so fares for this new route can be fetched. HTML is binding on the other side.
         * 
         */
        function addRoute() {
            add_route_format($scope.route_count, {
                origin: '',
                departure_date: new Date(),
                return_date: new Date()
            });
        }


        /**
         * @ngdoc method
         * @name addRoute
         * @methodOf flynmeet.search_controller.controllers.SearchController
         * @description
         * Delete Input route Data and HTML input upon user request. There is no index here because it's always the last one to be deleted.
         * 
         */
        function delRoute() {
            $scope.route_count--;
            delete $scope.search_routes[$scope.route_count];
            delete $scope.autocomplete_origins[$scope.route_count];
            delete $scope.departure_datepickers[$scope.route_count];
            delete $scope.return_datepickers[$scope.route_count];
        }

    }
})();



/**
 * @ngdoc controller
 * @name flynmeet.search_controller.controllers:ResController
 * @description
 * A description of the controller, service or filter
 */
(function () {
    'use strict';

    angular
        .module('flynmeet.search_controller.controllers')
        .controller('ResController', ResController)

    ResController.$inject = ['$location', '$scope', 'searchFares', '$filter', '$cookies'];

    /**
     * @ngdoc method
     * @name ResController
     * @methodOf flynmeet.search_controller.controllers.ResController
     * @description
     * Function that instanciates the controller
     * 
     * @param   {function} $location   
     * @param   {object}   $scope      
     * @param   {object}   searchFares Service that will be serving the controller with data to process, here it would be results containing quotes.
     * @param   {function} $filter     [[Description]]
     * @param   {Array} $cookies    [[Description]]
     */
    function ResController($location, $scope, searchFares, $filter, $cookies) {

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
         * @ngdoc method
         * @name initialize
         * @methodOf flynmeet.search_controller.controllers.ResController
         * @description
         * Actions to be performed when this controller is instantiated
         * 
         */
        function initialize() {
            displayResults($scope.priority);
        }


        /**
         * @ngdoc method
         * @name displayResults
         * @methodOf flynmeet.search_controller.controllers.ResController
         * @description
         * Call the service that will provide the Quotes then sort them before display
         * 
         */
        function displayResults() {
            var results = searchFares.get_search_results();
            SortResults($scope.priority, results);
        }


        /**
         * @ngdoc method
         * @name SortResults
         * @methodOf flynmeet.search_controller.controllers.ResController
         * @description
         * Process and compare the results to return an array of routes according to the mode of priority that has been set.
         * 
         * @param {boolean} priority Set the priority type for sorting ('allroutes', 'Route')
         * @param {object} res contains the result to sort.
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
         * @ngdoc method
         * @name AdvancedSorting
         * @methodOf flynmeet.search_controller.controllers.ResController
         * @description
         * Recursive function sorting the different quotes for each destination, from the cheapest to the more expensive
         * 
         * @param index is the cursor position in the reference table/object
         * @param new_obj is the object that is create in each function iteration then transfered to the next iteration
         * @param ref_obj is the reference table/object
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
         * @ngdoc method
         * @name formatThatForMe
         * @methodOf flynmeet.search_controller.controllers.ResController
         * @description
         * Format the results Quotes table in the proper structure so we can use it properly.
         * 
         * @param   {number}  index   is the cursor position in the reference table/object
         * @param   {object}  ref_obj Contain the reference object from where we will start sorting
         * @returns {boolean} True is succeeded, False if failed
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
         * @ngdoc method
         * @name filterObjByContaining
         * @methodOf flynmeet.search_controller.controllers.ResController
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
    } // end Rescontroller function
})();




/**
 * @ngdoc controller
 * @name flynmeet.search_controller.controllers:ContextController
 * @description
 * Manage the session/user context in term of Locale/Language and Currency
 */
(function () {
    'use strict';

    angular
        .module('flynmeet.search_controller.controllers')
        .controller('ContextController', ContextController)

    ContextController.$inject = ['$location', '$scope', '$uibModal', '$log', 'contextSetter', '$cookies'];


    /**
     * @ngdoc method
     * @name ContextController
     * @methodOf flynmeet.search_controller.controllers.ContextController
     * @description
     * Function that instanciates the controller
     * 
     * @param   {object}   $location     
     * @param   {object}   $scope      
     * @param   {object}   $uibModal     Allow to open and control a windows' box
     * @param   {object}   $log          
     * @param   {function} contextSetter Service that will set session context inside the cookies
     * @param   {object}   $cookies      Help us manage session data.
     */
    function ContextController($location, $scope, $uibModal, $log, contextSetter, $cookies) {

        contextSetter.GetContext();

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
                contextSetter.GetContext();
                location_management();
                $scope.currency = $cookies.getObject('context.currency');
                $scope.country = $cookies.getObject('context.country');
                $scope.locale = $cookies.getObject('context.locale');
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        /**
         * @ngdoc method
         * @name relocate
         * @methodOf flynmeet.search_controller.controllers.ContextController
         * @description
         * Function that will return the webpage url for the specified language. See supported languages
         * 
         * @param   {string}   url  input URL to transform
         * @param   {string}   pref_language Language to which we will relocate to for that page.
         * @returns {string}   Return either error or the URL page to redirect to.
         */
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

        /**
         * @ngdoc method
         * @name location_management
         * @methodOf flynmeet.search_controller.controllers.ContextController
         * @description
         * Check if the required web page matches the language of the USER, and call the relocate function accordingly.
         * 
         */
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
 * @ngdoc controller
 * @name flynmeet.search_controller.controllers:ContextBoxInstanceCtrl
 * @description
 * Manage little box where the user can change context in term of Locale/Language and Currency
 */
(function () {
    'use strict';

    angular
        .module('flynmeet.search_controller.controllers')
        .controller('ContextBoxInstanceCtrl', ContextBoxInstanceCtrl)

    ContextBoxInstanceCtrl.$inject = ['$scope', '$uibModalInstance', 'contextSetter', '$filter', '$cookies'];

    /**
     * @ngdoc method
     * @name ContextBoxInstanceCtrl
     * @methodOf flynmeet.search_controller.controllers.ContextBoxInstanceCtrl
     * @description
     * Function that instanciates the controller
     * @param   {object}   $scope            
     * @param   {function} $uibModalInstance Control the little box
     * @param   {object}   contextSetter     Service that will set session context inside the cookies
     * @param   {function} $filter           Use the Filter module
     * @param   {object} $cookies            Help us to get previous session data and set new session data
     */
    function ContextBoxInstanceCtrl($scope, $uibModalInstance, contextSetter, $filter, $cookies) {

        $scope.locales = contextSetter.get_locales();
        $scope.countries = contextSetter.get_countries();
        $scope.currencies = contextSetter.get_currencies();
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
         * @ngdoc method
         * @name filterObjByContaining
         * @methodOf flynmeet.search_controller.controllers.ContextBoxInstanceCtrl
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
    }
})();