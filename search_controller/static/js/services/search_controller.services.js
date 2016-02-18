/**
* Search
* @namespace flynmeet.search_controller.services
*/
(function () {
    'use strict';

    angular
        .module('flynmeet.search_controller.services')
        .factory('SearchFares', SearchFares)
        .service('SortFares', SortFares);

    SearchFares.$inject = ['$cookies', '$http', 'SortFares', '$location'];
    SortFares.$inject = ['$cookies', '$http', '$filter'];

    /**
    * @namespace SearchFares
    * @returns {Factory}
    */
    function SearchFares($cookies, $http, SortFares, $location) {
        /**
        * @name SearchFares
        * @desc The Factory to be returned
        */
        var SearchFares = {
            CheapestDests: CheapestDests,
//           GetOrigins : GetOrigins,
            //cheapestCommonDests: cheapestCommonDests,
            //cheapestFares: cheapestFares,
            //cheapestCommonFares: cheapestCommonFares,
        };
        return SearchFares;

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
                SortFares.set_search_results(data.data);
                console.log(SortFares.get_search_results());
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
    
    function SortFares ($cookies, $http, $filter) {
            var search_results = {};
            var sorted_results = {};
            
            var get_search_results = function () {
                return search_results;
            };
            
            var set_search_results = function (results) {
                return search_results = results;
            };
            
            var get_sorted_results = function () {
                return sorted_results;
            };
            
            var set_sorted_results = function (results) {
                sorted_results = results;
            };
            
            var SortResults = SortResults;
            
            return {
                get_search_results: get_search_results,
                set_search_results: set_search_results,
                get_sorted_results: get_sorted_results,
                set_sorted_results: set_sorted_results,
                SortResults: SortResults,
              };
    
        
            /**
            * @name SortResults
            * @desc Process and compare the results to return an array of routes according to
            * the mode of priority that has been set
            * @memberOf flynmeet.search_controller.controllers.SearchFares
            */
            function SortResults(priority) {
                var res = get_search_results();
                if (priority['mode']) {
                    if (priority['mode'] == 'allroutes') {
                        // Process with sorting with a common cheapest destination
                        // basically check the position on the table
                        var sorted_data = [];
//                            sorted_data = {
//                                "Destination_id" : {
//                                    destination) : {
//                                        quoteid,
//                                        Minprice
//                                    },  
//                                    route2: {
//                                       quoteid,
//                                        Minprice
//                                    },...   
//                                }
//                            }
                        var global_quotes = [];
                        var obj = [];
                        if (Object.keys(res).length == 1) {
                            for (var i = 0; i < Object.keys(res[0].Quotes).length; i++) {
                                obj[i] = formatThatForMe (i, res);
                            }    
                        } else {
                            obj = AdvancedSorting(0, new Array(), res );       
                        }
                        console.log(obj);
                        set_sorted_results ({'places': res[0].Places, 'quotes': obj});
                    }
                    else if (priority['mode'] == 'route') {}
                        // check priority number
                        // then process accordingly
                }
            }
        
//            function CheapestTotalOnAllRoute(global_quotes) {
//                var obj = {};
//                for (var i = 0; i < global_quotes[0].length; i++) {
//                    // quotes access
//                    var destination = global_quotes[0][i].OutboundLeg.DestinationId;
//                    var price = global_quotes[0][i].MinPrice;
//                    obj[destination] = {
//                        'destination':destination, 
//                        'total_price': price, 
//                        'presence_count': global_quotes.length-1, 
//                        'quotes': [],
//                    };
//                    console.log(global_quotes.length);
//                    for (var j = 1; j < global_quotes.length; j++){
//                        for(var k = 0; k < global_quotes[j].length; k++) {
//                            if (global_quotes[j][k].OutboundLeg.DestinationId == destination) {
//                                obj[destination].total_price += global_quotes[j][k].MinPrice;
//                                obj[destination].quotes.push(global_quotes[j][k].QuoteID);
//                                obj[destination].presence_count -= 1;
//                            }
//                        }
//                    }
//                    if (obj[destination].presence_count != 0) {
//                        delete obj[destination];
//                    }
//                }
//                return $filter('orderBy')(obj, 'total_price');
//            };


            function SortMeThatRightNow(index, new_obj, ref_obj) {
                var obj = {};
                if (index == Object.keys(ref_obj).length) {
                    return new_obj;
                }
                if (Object.keys(new_obj).length == 0) {
                    new_obj[index] = ref_obj[index];
                    index = index +1;
                }
                for (var i = 0; i < Object.keys(new_obj).length; i++) {
                    if (ref_obj[index] <= new_obj[i]) {
                    // case were item in ref is smaller than actual -> insert
                        for (var j = i; j < Object.keys(new_obj).length; j++) {
                            // shift all the items of 1 offset
                            obj[j+1] = new_obj[j];    
                        }
                    // insert the object in between
                        obj[i] = ref_obj[index];
                        break;
                    } else if (i == Object.keys(new_obj).length-1) {
                    // if we are at the end of the table, insert the item
                        obj[i+1] = ref_obj[index];
                    }
                    //  we keep copying the actual into the new
                    obj[i]= new_obj[i];
                }
                return SortMeThatRightNow(index+1, obj, ref_obj);   
           };
        
        function AdvancedSorting (index, new_obj, ref_obj) {
                var obj = [];          
                if (index >= Object.keys(ref_obj).length-1) {
                    return new_obj;
                }
                if (ref_obj[index]['Quotes'] == '[]') {
                    return false;
                }
                console.log(ref_obj[index]['Quotes']);
                if (Object.keys(new_obj).length == 0) {
                    new_obj[index] = formatThatForMe(index,ref_obj) ;
                    index = index +1;
                }
                for (var i = 0; i < Object.keys(new_obj).length; i++) {
                    var struct = formatThatForMe (index, ref_obj) ;
                    if (struct.total_price <= new_obj[i].total_price) {
                    // case were item in ref is smaller than actual -> insert
                        for (var j = i; j < Object.keys(new_obj).length; j++) {
                            // shift all the items of 1 offset
                            obj[j+1] = new_obj[j];    
                        }
                    // insert the object in between
                        obj[i] = struct;
                        break;
                    } else if (i == Object.keys(new_obj).length-1) {
                    // if we are at the end of the table, insert the item
                        obj[i+1] = struct;
                    }
                    //  we keep copying the actual into the new
                    obj[i]= new_obj[i];
                }
                return AdvancedSorting(index+1, obj, ref_obj);   
           };
        
            function formatThatForMe (index, ref_obj) {
                // we expect to receive input of quotes as the following
                // {'0': {'quotes': [{quoteId,minPrice,...}, {quoteId,minPrice,...}, {quoteId,minPrice,...} ], 'places': [{..}, {..}]},
                // {'1': {'quotes': [{quoteId,minPrice,...}, {quoteId,minPrice,...}, {quoteId,minPrice,...} ], 'places': [{..}, {..}]},,
                // {'2': {'quotes': [{quoteId,minPrice,...}, {quoteId,minPrice,...}, {quoteId,minPrice,...} ], 'places': [{..}, {..}]},
                // }
                if (Object.keys(ref_obj[0].Quotes) != 0) {
                    var destination_id = ref_obj[0]['Quotes'][index].OutboundLeg.DestinationId;
                    var new_obj = {}
                    new_obj['DestinationId'] = destination_id
                    new_obj['dest_quotes'] = { '0': ref_obj[0]['Quotes'][index]};
                    new_obj['total_price'] = ref_obj[0]['Quotes'][index].MinPrice;
                    for (var i = 1; i < Object.keys(ref_obj).length; i++) {
                        var quote = filterObjByContaining (ref_obj[i]['Quotes'],'OutboundLeg', 'DestinationId', destination_id);
                        if (quote == 'undefined') {
                            new_obj['dest_quotes'][i] = null;
                            new_obj['absence_flag'] = true;
                        }
                        new_obj['dest_quotes'][i] = quote;
                        new_obj['total_price'] += quote.MinPrice;
                    }
                    return new_obj;
                } else {return false;}
            };
    
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
                        if (item[fieldfilter][subfieldfilter] == value) {
                            return item;
                        }
                    })
                }
            };
        }
})();