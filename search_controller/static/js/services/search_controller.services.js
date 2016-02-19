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
//                var res = {"0":angular.fromJson("{\"Quotes\":[{\"QuoteId\":1,\"MinPrice\":363.0,\"Direct\":false,\"OutboundLeg\":{\"CarrierIds\":[1426],\"OriginId\":81870,\"DestinationId\":74770,\"DepartureDate\":\"2016-02-13T00:00:00\"},\"InboundLeg\":{\"CarrierIds\":[1625],\"OriginId\":74770,\"DestinationId\":81870,\"DepartureDate\":\"2016-02-26T00:00:00\"},\"QuoteDateTime\":\"2016-02-13T05:02:00\"},{\"QuoteId\":2,\"MinPrice\":489.0,\"Direct\":true,\"OutboundLeg\":{\"CarrierIds\":[1762],\"OriginId\":81870,\"DestinationId\":46915,\"DepartureDate\":\"2016-02-13T00:00:00\"},\"InboundLeg\":{\"CarrierIds\":[1762],\"OriginId\":46915,\"DestinationId\":81870,\"DepartureDate\":\"2016-02-26T00:00:00\"},\"QuoteDateTime\":\"2016-02-12T20:34:00\"},{\"QuoteId\":3,\"MinPrice\":115.0,\"Direct\":true,\"OutboundLeg\":{\"CarrierIds\":[1281],\"OriginId\":81870,\"DestinationId\":44907,\"DepartureDate\":\"2016-02-13T00:00:00\"},\"InboundLeg\":{\"CarrierIds\":[843],\"OriginId\":44907,\"DestinationId\":81870,\"DepartureDate\":\"2016-02-26T00:00:00\"},\"QuoteDateTime\":\"2016-02-13T07:54:00\"},{\"QuoteId\":4,\"MinPrice\":392.0,\"Direct\":true,\"OutboundLeg\":{\"CarrierIds\":[1762],\"OriginId\":81870,\"DestinationId\":57284,\"DepartureDate\":\"2016-02-13T00:00:00\"},\"InboundLeg\":{\"CarrierIds\":[1762],\"OriginId\":57284,\"DestinationId\":81870,\"DepartureDate\":\"2016-02-26T00:00:00\"},\"QuoteDateTime\":\"2016-02-11T22:35:00\"},{\"QuoteId\":5,\"MinPrice\":263.0,\"Direct\":false,\"OutboundLeg\":{\"CarrierIds\":[1426],\"OriginId\":81870,\"DestinationId\":45291,\"DepartureDate\":\"2016-02-13T00:00:00\"},\"InboundLeg\":{\"CarrierIds\":[1426],\"OriginId\":45291,\"DestinationId\":81870,\"DepartureDate\":\"2016-02-26T00:00:00\"},\"QuoteDateTime\":\"2016-02-11T06:58:00\"},{\"QuoteId\":6,\"MinPrice\":236.0,\"Direct\":true,\"OutboundLeg\":{\"CarrierIds\":[1281],\"OriginId\":81870,\"DestinationId\":75192,\"DepartureDate\":\"2016-02-13T00:00:00\"},\"InboundLeg\":{\"CarrierIds\":[1281],\"OriginId\":75192,\"DestinationId\":81870,\"DepartureDate\":\"2016-02-26T00:00:00\"},\"QuoteDateTime\":\"2016-02-13T02:28:00\"},{\"QuoteId\":7,\"MinPrice\":859.0,\"Direct\":false,\"OutboundLeg\":{\"CarrierIds\":[843],\"OriginId\":81870,\"DestinationId\":58542,\"DepartureDate\":\"2016-02-13T00:00:00\"},\"InboundLeg\":{\"CarrierIds\":[843],\"OriginId\":58542,\"DestinationId\":81870,\"DepartureDate\":\"2016-02-26T00:00:00\"},\"QuoteDateTime\":\"2016-02-13T00:25:00\"},{\"QuoteId\":8,\"MinPrice\":1942.0,\"Direct\":false,\"OutboundLeg\":{\"CarrierIds\":[],\"OriginId\":81870,\"DestinationId\":84645,\"DepartureDate\":\"2016-02-13T00:00:00\"},\"InboundLeg\":{\"CarrierIds\":[],\"OriginId\":84645,\"DestinationId\":81870,\"DepartureDate\":\"2016-02-26T00:00:00\"},\"QuoteDateTime\":\"2016-02-13T00:40:00\"},{\"QuoteId\":9,\"MinPrice\":377.0,\"Direct\":false,\"OutboundLeg\":{\"CarrierIds\":[1426],\"OriginId\":81870,\"DestinationId\":45186,\"DepartureDate\":\"2016-02-13T00:00:00\"},\"InboundLeg\":{\"CarrierIds\":[843],\"OriginId\":45186,\"DestinationId\":81870,\"DepartureDate\":\"2016-02-26T00:00:00\"},\"QuoteDateTime\":\"2016-02-12T14:42:00\"},{\"QuoteId\":10,\"MinPrice\":1536.0,\"Direct\":false,\"OutboundLeg\":{\"CarrierIds\":[858],\"OriginId\":81870,\"DestinationId\":68177,\"DepartureDate\":\"2016-02-13T00:00:00\"},\"InboundLeg\":{\"CarrierIds\":[858],\"OriginId\":68177,\"DestinationId\":81870,\"DepartureDate\":\"2016-02-26T00:00:00\"},\"QuoteDateTime\":\"2016-02-13T06:50:00\"},{\"QuoteId\":11,\"MinPrice\":66.0,\"Direct\":true,\"OutboundLeg\":{\"CarrierIds\":[1762],\"OriginId\":81870,\"DestinationId\":64012,\"DepartureDate\":\"2016-02-13T00:00:00\"},\"InboundLeg\":{\"CarrierIds\":[843],\"OriginId\":64012,\"DestinationId\":81870,\"DepartureDate\":\"2016-02-26T00:00:00\"},\"QuoteDateTime\":\"2016-02-13T00:23:00\"},{\"QuoteId\":12,\"MinPrice\":957.0,\"Direct\":true,\"OutboundLeg\":{\"CarrierIds\":[1713],\"OriginId\":81870,\"DestinationId\":68284,\"DepartureDate\":\"2016-02-13T00:00:00\"},\"InboundLeg\":{\"CarrierIds\":[1713],\"OriginId\":68284,\"DestinationId\":81870,\"DepartureDate\":\"2016-02-26T00:00:00\"},\"QuoteDateTime\":\"2016-02-13T03:00:00\"}],\"Currencies\":[{\"Code\":\"SGD\",\"Symbol\":\"$\",\"ThousandsSeparator\":\",\",\"DecimalSeparator\":\".\",\"SymbolOnLeft\":true,\"SpaceBetweenAmountAndSymbol\":false,\"RoundingCoefficient\":0,\"DecimalDigits\":2}],\"Places\":[{\"PlaceId\":837,\"Name\":\"United Arab Emirates\",\"Type\":\"Country\"},{\"PlaceId\":838,\"Name\":\"Afghanistan\",\"Type\":\"Country\"},{\"PlaceId\":839,\"Name\":\"Antigua and Barbuda\",\"Type\":\"Country\"},{\"PlaceId\":844,\"Name\":\"Albania\",\"Type\":\"Country\"},{\"PlaceId\":845,\"Name\":\"Armenia\",\"Type\":\"Country\"},{\"PlaceId\":847,\"Name\":\"Angola\",\"Type\":\"Country\"},{\"PlaceId\":850,\"Name\":\"Argentina\",\"Type\":\"Country\"},{\"PlaceId\":852,\"Name\":\"Austria\",\"Type\":\"Country\"},{\"PlaceId\":853,\"Name\":\"Australia\",\"Type\":\"Country\"},{\"PlaceId\":855,\"Name\":\"Aruba\",\"Type\":\"Country\"},{\"PlaceId\":858,\"Name\":\"Azerbaijan\",\"Type\":\"Country\"},{\"PlaceId\":881,\"Name\":\"Bosnia and Herzegovina\",\"Type\":\"Country\"},{\"PlaceId\":882,\"Name\":\"Barbados\",\"Type\":\"Country\"},{\"PlaceId\":884,\"Name\":\"Bangladesh\",\"Type\":\"Country\"},{\"PlaceId\":885,\"Name\":\"Belgium\",\"Type\":\"Country\"},{\"PlaceId\":886,\"Name\":\"Burkina Faso\",\"Type\":\"Country\"},{\"PlaceId\":887,\"Name\":\"Bulgaria\",\"Type\":\"Country\"},{\"PlaceId\":888,\"Name\":\"Bahrain\",\"Type\":\"Country\"},{\"PlaceId\":889,\"Name\":\"Burundi\",\"Type\":\"Country\"},{\"PlaceId\":890,\"Name\":\"Benin\",\"Type\":\"Country\"},{\"PlaceId\":893,\"Name\":\"Bermuda\",\"Type\":\"Country\"},{\"PlaceId\":894,\"Name\":\"Brunei\",\"Type\":\"Country\"},{\"PlaceId\":895,\"Name\":\"Bolivia\",\"Type\":\"Country\"},{\"PlaceId\":897,\"Name\":\"Caribbean Netherlands\",\"Type\":\"Country\"},{\"PlaceId\":898,\"Name\":\"Brazil\",\"Type\":\"Country\"},{\"PlaceId\":899,\"Name\":\"Bahamas\",\"Type\":\"Country\"},{\"PlaceId\":903,\"Name\":\"Botswana\",\"Type\":\"Country\"},{\"PlaceId\":905,\"Name\":\"Belarus\",\"Type\":\"Country\"},{\"PlaceId\":906,\"Name\":\"Belize\",\"Type\":\"Country\"},{\"PlaceId\":929,\"Name\":\"Canada\",\"Type\":\"Country\"},{\"PlaceId\":932,\"Name\":\"DR Congo\",\"Type\":\"Country\"},{\"PlaceId\":933,\"Name\":\"Crimea\",\"Type\":\"Country\"},{\"PlaceId\":934,\"Name\":\"Central African Republic\",\"Type\":\"Country\"},{\"PlaceId\":935,\"Name\":\"Congo\",\"Type\":\"Country\"},{\"PlaceId\":936,\"Name\":\"Switzerland\",\"Type\":\"Country\"},{\"PlaceId\":937,\"Name\":\"Ivory Coast\",\"Type\":\"Country\"},{\"PlaceId\":939,\"Name\":\"Cook Islands\",\"Type\":\"Country\"},{\"PlaceId\":940,\"Name\":\"Chile\",\"Type\":\"Country\"},{\"PlaceId\":941,\"Name\":\"Cameroon\",\"Type\":\"Country\"},{\"PlaceId\":942,\"Name\":\"China\",\"Type\":\"Country\"},{\"PlaceId\":943,\"Name\":\"Colombia\",\"Type\":\"Country\"},{\"PlaceId\":946,\"Name\":\"Costa Rica\",\"Type\":\"Country\"},{\"PlaceId\":949,\"Name\":\"Cuba\",\"Type\":\"Country\"},{\"PlaceId\":950,\"Name\":\"Cape Verde\",\"Type\":\"Country\"},{\"PlaceId\":951,\"Name\":\"Curacao\",\"Type\":\"Country\"},{\"PlaceId\":953,\"Name\":\"Cyprus\",\"Type\":\"Country\"},{\"PlaceId\":954,\"Name\":\"Czech Republic\",\"Type\":\"Country\"},{\"PlaceId\":981,\"Name\":\"Germany\",\"Type\":\"Country\"},{\"PlaceId\":986,\"Name\":\"Djibouti\",\"Type\":\"Country\"},{\"PlaceId\":987,\"Name\":\"Denmark\",\"Type\":\"Country\"},{\"PlaceId\":991,\"Name\":\"Dominican Republic\",\"Type\":\"Country\"},{\"PlaceId\":1002,\"Name\":\"Algeria\",\"Type\":\"Country\"},{\"PlaceId\":1027,\"Name\":\"Ecuador\",\"Type\":\"Country\"},{\"PlaceId\":1029,\"Name\":\"Estonia\",\"Type\":\"Country\"},{\"PlaceId\":1031,\"Name\":\"Egypt\",\"Type\":\"Country\"},{\"PlaceId\":1042,\"Name\":\"Eritrea\",\"Type\":\"Country\"},{\"PlaceId\":1043,\"Name\":\"Spain\",\"Type\":\"Country\"},{\"PlaceId\":1044,\"Name\":\"Ethiopia\",\"Type\":\"Country\"},{\"PlaceId\":1081,\"Name\":\"Finland\",\"Type\":\"Country\"},{\"PlaceId\":1082,\"Name\":\"Fiji\",\"Type\":\"Country\"},{\"PlaceId\":1090,\"Name\":\"France\",\"Type\":\"Country\"},{\"PlaceId\":1121,\"Name\":\"Gabon\",\"Type\":\"Country\"},{\"PlaceId\":1124,\"Name\":\"Grenada\",\"Type\":\"Country\"},{\"PlaceId\":1125,\"Name\":\"Georgia\",\"Type\":\"Country\"},{\"PlaceId\":1126,\"Name\":\"French Guiana\",\"Type\":\"Country\"},{\"PlaceId\":1127,\"Name\":\"Guernsey\",\"Type\":\"Country\"},{\"PlaceId\":1128,\"Name\":\"Ghana\",\"Type\":\"Country\"},{\"PlaceId\":1129,\"Name\":\"Gibraltar\",\"Type\":\"Country\"},{\"PlaceId\":1132,\"Name\":\"Greenland\",\"Type\":\"Country\"},{\"PlaceId\":1133,\"Name\":\"Gambia\",\"Type\":\"Country\"},{\"PlaceId\":1134,\"Name\":\"Guinea\",\"Type\":\"Country\"},{\"PlaceId\":1136,\"Name\":\"Guadeloupe\",\"Type\":\"Country\"},{\"PlaceId\":1137,\"Name\":\"Equatorial Guinea\",\"Type\":\"Country\"},{\"PlaceId\":1138,\"Name\":\"Greece\",\"Type\":\"Country\"},{\"PlaceId\":1140,\"Name\":\"Guatemala\",\"Type\":\"Country\"},{\"PlaceId\":1141,\"Name\":\"Guam\",\"Type\":\"Country\"},{\"PlaceId\":1143,\"Name\":\"Guinea-Bissau\",\"Type\":\"Country\"},{\"PlaceId\":1179,\"Name\":\"Hong Kong\",\"Type\":\"Country\"},{\"PlaceId\":1182,\"Name\":\"Honduras\",\"Type\":\"Country\"},{\"PlaceId\":1186,\"Name\":\"Croatia\",\"Type\":\"Country\"},{\"PlaceId\":1188,\"Name\":\"Haiti\",\"Type\":\"Country\"},{\"PlaceId\":1189,\"Name\":\"Hungary\",\"Type\":\"Country\"},{\"PlaceId\":1220,\"Name\":\"Indonesia\",\"Type\":\"Country\"},{\"PlaceId\":1221,\"Name\":\"Ireland\",\"Type\":\"Country\"},{\"PlaceId\":1228,\"Name\":\"Israel\",\"Type\":\"Country\"},{\"PlaceId\":1230,\"Name\":\"India\",\"Type\":\"Country\"},{\"PlaceId\":1233,\"Name\":\"Iraq\",\"Type\":\"Country\"},{\"PlaceId\":1234,\"Name\":\"Iran\",\"Type\":\"Country\"},{\"PlaceId\":1235,\"Name\":\"Iceland\",\"Type\":\"Country\"},{\"PlaceId\":1236,\"Name\":\"Italy\",\"Type\":\"Country\"},{\"PlaceId\":1277,\"Name\":\"Jamaica\",\"Type\":\"Country\"},{\"PlaceId\":1279,\"Name\":\"Jordan\",\"Type\":\"Country\"},{\"PlaceId\":1280,\"Name\":\"Japan\",\"Type\":\"Country\"},{\"PlaceId\":1317,\"Name\":\"Kenya\",\"Type\":\"Country\"},{\"PlaceId\":1319,\"Name\":\"Kyrgyzstan\",\"Type\":\"Country\"},{\"PlaceId\":1320,\"Name\":\"Cambodia\",\"Type\":\"Country\"},{\"PlaceId\":1326,\"Name\":\"Saint Kitts and Nevis\",\"Type\":\"Country\"},{\"PlaceId\":1327,\"Name\":\"Kosovo\",\"Type\":\"Country\"},{\"PlaceId\":1330,\"Name\":\"South Korea\",\"Type\":\"Country\"},{\"PlaceId\":1335,\"Name\":\"Kuwait\",\"Type\":\"Country\"},{\"PlaceId\":1337,\"Name\":\"Cayman Islands\",\"Type\":\"Country\"},{\"PlaceId\":1338,\"Name\":\"Kazakhstan\",\"Type\":\"Country\"},{\"PlaceId\":1361,\"Name\":\"Laos\",\"Type\":\"Country\"},{\"PlaceId\":1362,\"Name\":\"Lebanon\",\"Type\":\"Country\"},{\"PlaceId\":1363,\"Name\":\"Saint Lucia\",\"Type\":\"Country\"},{\"PlaceId\":1371,\"Name\":\"Sri Lanka\",\"Type\":\"Country\"},{\"PlaceId\":1378,\"Name\":\"Liberia\",\"Type\":\"Country\"},{\"PlaceId\":1379,\"Name\":\"Lesotho\",\"Type\":\"Country\"},{\"PlaceId\":1380,\"Name\":\"Lithuania\",\"Type\":\"Country\"},{\"PlaceId\":1381,\"Name\":\"Luxembourg\",\"Type\":\"Country\"},{\"PlaceId\":1382,\"Name\":\"Latvia\",\"Type\":\"Country\"},{\"PlaceId\":1385,\"Name\":\"Libya\",\"Type\":\"Country\"},{\"PlaceId\":1409,\"Name\":\"Morocco\",\"Type\":\"Country\"},{\"PlaceId\":1412,\"Name\":\"Moldova\",\"Type\":\"Country\"},{\"PlaceId\":1413,\"Name\":\"Montenegro\",\"Type\":\"Country\"},{\"PlaceId\":1415,\"Name\":\"Madagascar\",\"Type\":\"Country\"},{\"PlaceId\":1419,\"Name\":\"Republic of Macedonia\",\"Type\":\"Country\"},{\"PlaceId\":1420,\"Name\":\"Mali\",\"Type\":\"Country\"},{\"PlaceId\":1421,\"Name\":\"Myanmar\",\"Type\":\"Country\"},{\"PlaceId\":1422,\"Name\":\"Mongolia\",\"Type\":\"Country\"},{\"PlaceId\":1423,\"Name\":\"Macau\",\"Type\":\"Country\"},{\"PlaceId\":1424,\"Name\":\"Northern Mariana Islands\",\"Type\":\"Country\"},{\"PlaceId\":1425,\"Name\":\"Martinique\",\"Type\":\"Country\"},{\"PlaceId\":1426,\"Name\":\"Mauritania\",\"Type\":\"Country\"},{\"PlaceId\":1428,\"Name\":\"Malta\",\"Type\":\"Country\"},{\"PlaceId\":1429,\"Name\":\"Mauritius\",\"Type\":\"Country\"},{\"PlaceId\":1430,\"Name\":\"Maldives\",\"Type\":\"Country\"},{\"PlaceId\":1431,\"Name\":\"Malawi\",\"Type\":\"Country\"},{\"PlaceId\":1432,\"Name\":\"Mexico\",\"Type\":\"Country\"},{\"PlaceId\":1433,\"Name\":\"Malaysia\",\"Type\":\"Country\"},{\"PlaceId\":1434,\"Name\":\"Mozambique\",\"Type\":\"Country\"},{\"PlaceId\":1457,\"Name\":\"Namibia\",\"Type\":\"Country\"},{\"PlaceId\":1459,\"Name\":\"New Caledonia\",\"Type\":\"Country\"},{\"PlaceId\":1461,\"Name\":\"Niger\",\"Type\":\"Country\"},{\"PlaceId\":1463,\"Name\":\"Nigeria\",\"Type\":\"Country\"},{\"PlaceId\":1465,\"Name\":\"Nicaragua\",\"Type\":\"Country\"},{\"PlaceId\":1468,\"Name\":\"Netherlands\",\"Type\":\"Country\"},{\"PlaceId\":1471,\"Name\":\"Norway\",\"Type\":\"Country\"},{\"PlaceId\":1472,\"Name\":\"Nepal\",\"Type\":\"Country\"},{\"PlaceId\":1482,\"Name\":\"New Zealand\",\"Type\":\"Country\"},{\"PlaceId\":1517,\"Name\":\"Oman\",\"Type\":\"Country\"},{\"PlaceId\":1553,\"Name\":\"Panama\",\"Type\":\"Country\"},{\"PlaceId\":1557,\"Name\":\"Peru\",\"Type\":\"Country\"},{\"PlaceId\":1558,\"Name\":\"French Polynesia\",\"Type\":\"Country\"},{\"PlaceId\":1559,\"Name\":\"Papua New Guinea\",\"Type\":\"Country\"},{\"PlaceId\":1560,\"Name\":\"Philippines\",\"Type\":\"Country\"},{\"PlaceId\":1563,\"Name\":\"Pakistan\",\"Type\":\"Country\"},{\"PlaceId\":1564,\"Name\":\"Poland\",\"Type\":\"Country\"},{\"PlaceId\":1570,\"Name\":\"Puerto Rico\",\"Type\":\"Country\"},{\"PlaceId\":1572,\"Name\":\"Portugal\",\"Type\":\"Country\"},{\"PlaceId\":1575,\"Name\":\"Palau\",\"Type\":\"Country\"},{\"PlaceId\":1577,\"Name\":\"Paraguay\",\"Type\":\"Country\"},{\"PlaceId\":1601,\"Name\":\"Qatar\",\"Type\":\"Country\"},{\"PlaceId\":1653,\"Name\":\"Reunion\",\"Type\":\"Country\"},{\"PlaceId\":1663,\"Name\":\"Romania\",\"Type\":\"Country\"},{\"PlaceId\":1667,\"Name\":\"Serbia\",\"Type\":\"Country\"},{\"PlaceId\":1669,\"Name\":\"Russia\",\"Type\":\"Country\"},{\"PlaceId\":1671,\"Name\":\"Rwanda\",\"Type\":\"Country\"},{\"PlaceId\":1697,\"Name\":\"Saudi Arabia\",\"Type\":\"Country\"},{\"PlaceId\":1698,\"Name\":\"Solomon Islands\",\"Type\":\"Country\"},{\"PlaceId\":1699,\"Name\":\"Seychelles\",\"Type\":\"Country\"},{\"PlaceId\":1700,\"Name\":\"Sudan\",\"Type\":\"Country\"},{\"PlaceId\":1701,\"Name\":\"Sweden\",\"Type\":\"Country\"},{\"PlaceId\":1703,\"Name\":\"Singapore\",\"Type\":\"Country\"},{\"PlaceId\":1705,\"Name\":\"Slovenia\",\"Type\":\"Country\"},{\"PlaceId\":1707,\"Name\":\"Slovakia\",\"Type\":\"Country\"},{\"PlaceId\":1708,\"Name\":\"Sierra Leone\",\"Type\":\"Country\"},{\"PlaceId\":1710,\"Name\":\"Senegal\",\"Type\":\"Country\"},{\"PlaceId\":1711,\"Name\":\"Somalia\",\"Type\":\"Country\"},{\"PlaceId\":1714,\"Name\":\"Suriname\",\"Type\":\"Country\"},{\"PlaceId\":1715,\"Name\":\"South Sudan\",\"Type\":\"Country\"},{\"PlaceId\":1716,\"Name\":\"Sao Tome and Principe\",\"Type\":\"Country\"},{\"PlaceId\":1718,\"Name\":\"El Salvador\",\"Type\":\"Country\"},{\"PlaceId\":1720,\"Name\":\"St Maarten\",\"Type\":\"Country\"},{\"PlaceId\":1721,\"Name\":\"Syria\",\"Type\":\"Country\"},{\"PlaceId\":1747,\"Name\":\"Turks and Caicos Islands\",\"Type\":\"Country\"},{\"PlaceId\":1748,\"Name\":\"Chad\",\"Type\":\"Country\"},{\"PlaceId\":1751,\"Name\":\"Togo\",\"Type\":\"Country\"},{\"PlaceId\":1752,\"Name\":\"Thailand\",\"Type\":\"Country\"},{\"PlaceId\":1754,\"Name\":\"Tajikistan\",\"Type\":\"Country\"},{\"PlaceId\":1757,\"Name\":\"Turkmenistan\",\"Type\":\"Country\"},{\"PlaceId\":1758,\"Name\":\"Tunisia\",\"Type\":\"Country\"},{\"PlaceId\":1762,\"Name\":\"Turkey\",\"Type\":\"Country\"},{\"PlaceId\":1764,\"Name\":\"Trinidad and Tobago\",\"Type\":\"Country\"},{\"PlaceId\":1767,\"Name\":\"Taiwan\",\"Type\":\"Country\"},{\"PlaceId\":1770,\"Name\":\"Tanzania\",\"Type\":\"Country\"},{\"PlaceId\":1793,\"Name\":\"Ukraine\",\"Type\":\"Country\"},{\"PlaceId\":1799,\"Name\":\"Uganda\",\"Type\":\"Country\"},{\"PlaceId\":1803,\"Name\":\"United Kingdom\",\"Type\":\"Country\"},{\"PlaceId\":1811,\"Name\":\"United States\",\"Type\":\"Country\"},{\"PlaceId\":1817,\"Name\":\"Uruguay\",\"Type\":\"Country\"},{\"PlaceId\":1818,\"Name\":\"Uzbekistan\",\"Type\":\"Country\"},{\"PlaceId\":1845,\"Name\":\"Venezuela\",\"Type\":\"Country\"},{\"PlaceId\":1847,\"Name\":\"British Virgin Islands\",\"Type\":\"Country\"},{\"PlaceId\":1849,\"Name\":\"Virgin Islands\",\"Type\":\"Country\"},{\"PlaceId\":1854,\"Name\":\"Vietnam\",\"Type\":\"Country\"},{\"PlaceId\":1989,\"Name\":\"Yemen\",\"Type\":\"Country\"},{\"PlaceId\":2004,\"Name\":\"Mayotte\",\"Type\":\"Country\"},{\"PlaceId\":2033,\"Name\":\"South Africa\",\"Type\":\"Country\"},{\"PlaceId\":2045,\"Name\":\"Zambia\",\"Type\":\"Country\"},{\"PlaceId\":2055,\"Name\":\"Zimbabwe\",\"Type\":\"Country\"},{\"PlaceId\":40830,\"IataCode\":\"ARN\",\"Name\":\"Stockholm Arlanda\",\"Type\":\"Station\",\"CityName\":\"Stockholm\",\"CityId\":\"STOC\",\"CountryName\":\"Sweden\"},{\"PlaceId\":42607,\"IataCode\":\"BGO\",\"Name\":\"Bergen\",\"Type\":\"Station\",\"CityName\":\"Bergen\",\"CityId\":\"BERI\",\"CountryName\":\"Norway\"},{\"PlaceId\":45336,\"IataCode\":\"CPH\",\"Name\":\"Copenhagen\",\"Type\":\"Station\",\"CityName\":\"Copenhagen\",\"CityId\":\"COPE\",\"CountryName\":\"Denmark\"},{\"PlaceId\":54416,\"IataCode\":\"GMP\",\"Name\":\"Seoul Gimpo\",\"Type\":\"Station\",\"CityName\":\"Seoul\",\"CityId\":\"SELA\",\"CountryName\":\"South Korea\"},{\"PlaceId\":54833,\"IataCode\":\"GVA\",\"Name\":\"Geneva\",\"Type\":\"Station\",\"CityName\":\"Geneva\",\"CityId\":\"GENE\",\"CountryName\":\"Switzerland\"},{\"PlaceId\":56615,\"IataCode\":\"HKG\",\"Name\":\"Hong Kong International\",\"Type\":\"Station\",\"CityName\":\"Hong Kong\",\"CityId\":\"HKGA\",\"CountryName\":\"Hong Kong\"},{\"PlaceId\":58542,\"IataCode\":\"ICN\",\"Name\":\"Seoul Incheon Int'l\",\"Type\":\"Station\",\"CityName\":\"Seoul\",\"CityId\":\"SELA\",\"CountryName\":\"South Korea\"},{\"PlaceId\":63238,\"IataCode\":\"KEF\",\"Name\":\"Reykjavik Keflavik\",\"Type\":\"Station\",\"CityName\":\"Reykjavik\",\"CityId\":\"REYK\",\"CountryName\":\"Iceland\"},{\"PlaceId\":65655,\"IataCode\":\"LGW\",\"Name\":\"London Gatwick\",\"Type\":\"Station\",\"CityName\":\"London\",\"CityId\":\"LOND\",\"CountryName\":\"United Kingdom\"},{\"PlaceId\":65698,\"IataCode\":\"LHR\",\"Name\":\"London Heathrow\",\"Type\":\"Station\",\"CityName\":\"London\",\"CityId\":\"LOND\",\"CountryName\":\"United Kingdom\"},{\"PlaceId\":65747,\"IataCode\":\"LIS\",\"Name\":\"Lisbon\",\"Type\":\"Station\",\"CityName\":\"Lisbon\",\"CityId\":\"LISB\",\"CountryName\":\"Portugal\"},{\"PlaceId\":66270,\"IataCode\":\"LTN\",\"Name\":\"London Luton\",\"Type\":\"Station\",\"CityName\":\"London\",\"CityId\":\"LOND\",\"CountryName\":\"United Kingdom\"},{\"PlaceId\":74763,\"IataCode\":\"PEK\",\"Name\":\"Beijing Capital\",\"Type\":\"Station\",\"CityName\":\"Beijing\",\"CityId\":\"BJSA\",\"CountryName\":\"China\"},{\"PlaceId\":75383,\"IataCode\":\"PRG\",\"Name\":\"Prague\",\"Type\":\"Station\",\"CityName\":\"Prague\",\"CityId\":\"PRAG\",\"CountryName\":\"Czech Republic\"},{\"PlaceId\":75575,\"IataCode\":\"PVG\",\"Name\":\"Shanghai Pu Dong\",\"Type\":\"Station\",\"CityName\":\"Shanghai\",\"CityId\":\"CSHA\",\"CountryName\":\"China\"},{\"PlaceId\":79179,\"IataCode\":\"RAK\",\"Name\":\"Marrakech Menara\",\"Type\":\"Station\",\"CityName\":\"Marrakech Menara\",\"CityId\":\"MARR\",\"CountryName\":\"Morocco\"},{\"PlaceId\":81678,\"IataCode\":\"SEN\",\"Name\":\"London Southend\",\"Type\":\"Station\",\"CityName\":\"London\",\"CityId\":\"LOND\",\"CountryName\":\"United Kingdom\"},{\"PlaceId\":82398,\"IataCode\":\"STN\",\"Name\":\"London Stansted\",\"Type\":\"Station\",\"CityName\":\"London\",\"CityId\":\"LOND\",\"CountryName\":\"United Kingdom\"},{\"PlaceId\":3169460,\"IataCode\":\"LON\",\"Name\":\"London\",\"Type\":\"City\",\"CityName\":\"London\",\"CityId\":\"LOND\"}]}")
//};
//
//
//                res[1] = angular.fromJson("{\"Quotes\":[{\"QuoteId\":1,\"MinPrice\":363.0,\"Direct\":false,\"OutboundLeg\":{\"CarrierIds\":[1426],\"OriginId\":65655,\"DestinationId\":74770,\"DepartureDate\":\"2016-02-13T00:00:00\"},\"InboundLeg\":{\"CarrierIds\":[1625],\"OriginId\":74770,\"DestinationId\":65655,\"DepartureDate\":\"2016-02-26T00:00:00\"},\"QuoteDateTime\":\"2016-02-13T05:02:00\"},{\"QuoteId\":2,\"MinPrice\":3242.0,\"Direct\":true,\"OutboundLeg\":{\"CarrierIds\":[1762],\"OriginId\":65655,\"DestinationId\":46915,\"DepartureDate\":\"2016-02-13T00:00:00\"},\"InboundLeg\":{\"CarrierIds\":[1762],\"OriginId\":46915,\"DestinationId\":65655,\"DepartureDate\":\"2016-02-26T00:00:00\"},\"QuoteDateTime\":\"2016-02-12T20:34:00\"},{\"QuoteId\":3,\"MinPrice\":32.0,\"Direct\":true,\"OutboundLeg\":{\"CarrierIds\":[1281],\"OriginId\":65655,\"DestinationId\":44907,\"DepartureDate\":\"2016-02-13T00:00:00\"},\"InboundLeg\":{\"CarrierIds\":[843],\"OriginId\":44907,\"DestinationId\":65655,\"DepartureDate\":\"2016-02-26T00:00:00\"},\"QuoteDateTime\":\"2016-02-13T07:54:00\"},{\"QuoteId\":4,\"MinPrice\":392.0,\"Direct\":true,\"OutboundLeg\":{\"CarrierIds\":[1762],\"OriginId\":65655,\"DestinationId\":57284,\"DepartureDate\":\"2016-02-13T00:00:00\"},\"InboundLeg\":{\"CarrierIds\":[1762],\"OriginId\":57284,\"DestinationId\":65655,\"DepartureDate\":\"2016-02-26T00:00:00\"},\"QuoteDateTime\":\"2016-02-11T22:35:00\"},{\"QuoteId\":5,\"MinPrice\":34.0,\"Direct\":false,\"OutboundLeg\":{\"CarrierIds\":[1426],\"OriginId\":65655,\"DestinationId\":45291,\"DepartureDate\":\"2016-02-13T00:00:00\"},\"InboundLeg\":{\"CarrierIds\":[1426],\"OriginId\":45291,\"DestinationId\":65655,\"DepartureDate\":\"2016-02-26T00:00:00\"},\"QuoteDateTime\":\"2016-02-11T06:58:00\"},{\"QuoteId\":6,\"MinPrice\":3422.0,\"Direct\":true,\"OutboundLeg\":{\"CarrierIds\":[1281],\"OriginId\":65655,\"DestinationId\":75192,\"DepartureDate\":\"2016-02-13T00:00:00\"},\"InboundLeg\":{\"CarrierIds\":[1281],\"OriginId\":75192,\"DestinationId\":65655,\"DepartureDate\":\"2016-02-26T00:00:00\"},\"QuoteDateTime\":\"2016-02-13T02:28:00\"},{\"QuoteId\":7,\"MinPrice\":897.0,\"Direct\":false,\"OutboundLeg\":{\"CarrierIds\":[843],\"OriginId\":65655,\"DestinationId\":58542,\"DepartureDate\":\"2016-02-13T00:00:00\"},\"InboundLeg\":{\"CarrierIds\":[843],\"OriginId\":58542,\"DestinationId\":65655,\"DepartureDate\":\"2016-02-26T00:00:00\"},\"QuoteDateTime\":\"2016-02-13T00:25:00\"},{\"QuoteId\":8,\"MinPrice\":2345.0,\"Direct\":false,\"OutboundLeg\":{\"CarrierIds\":[],\"OriginId\":65655,\"DestinationId\":84645,\"DepartureDate\":\"2016-02-13T00:00:00\"},\"InboundLeg\":{\"CarrierIds\":[],\"OriginId\":84645,\"DestinationId\":65655,\"DepartureDate\":\"2016-02-26T00:00:00\"},\"QuoteDateTime\":\"2016-02-13T00:40:00\"},{\"QuoteId\":9,\"MinPrice\":455.0,\"Direct\":false,\"OutboundLeg\":{\"CarrierIds\":[1426],\"OriginId\":65655,\"DestinationId\":45186,\"DepartureDate\":\"2016-02-13T00:00:00\"},\"InboundLeg\":{\"CarrierIds\":[843],\"OriginId\":45186,\"DestinationId\":65655,\"DepartureDate\":\"2016-02-26T00:00:00\"},\"QuoteDateTime\":\"2016-02-12T14:42:00\"},{\"QuoteId\":10,\"MinPrice\":4323.0,\"Direct\":false,\"OutboundLeg\":{\"CarrierIds\":[858],\"OriginId\":65655,\"DestinationId\":68177,\"DepartureDate\":\"2016-02-13T00:00:00\"},\"InboundLeg\":{\"CarrierIds\":[858],\"OriginId\":68177,\"DestinationId\":65655,\"DepartureDate\":\"2016-02-26T00:00:00\"},\"QuoteDateTime\":\"2016-02-13T06:50:00\"},{\"QuoteId\":11,\"MinPrice\":665.0,\"Direct\":true,\"OutboundLeg\":{\"CarrierIds\":[1762],\"OriginId\":65655,\"DestinationId\":64012,\"DepartureDate\":\"2016-02-13T00:00:00\"},\"InboundLeg\":{\"CarrierIds\":[843],\"OriginId\":64012,\"DestinationId\":65655,\"DepartureDate\":\"2016-02-26T00:00:00\"},\"QuoteDateTime\":\"2016-02-13T00:23:00\"},{\"QuoteId\":12,\"MinPrice\":442.0,\"Direct\":true,\"OutboundLeg\":{\"CarrierIds\":[1713],\"OriginId\":65655,\"DestinationId\":68284,\"DepartureDate\":\"2016-02-13T00:00:00\"},\"InboundLeg\":{\"CarrierIds\":[1713],\"OriginId\":68284,\"DestinationId\":65655,\"DepartureDate\":\"2016-02-26T00:00:00\"},\"QuoteDateTime\":\"2016-02-13T03:00:00\"}],\"Currencies\":[{\"Code\":\"SGD\",\"Symbol\":\"$\",\"ThousandsSeparator\":\",\",\"DecimalSeparator\":\".\",\"SymbolOnLeft\":true,\"SpaceBetweenAmountAndSymbol\":false,\"RoundingCoefficient\":0,\"DecimalDigits\":2}],\"Places\":[{\"PlaceId\":837,\"Name\":\"United Arab Emirates\",\"Type\":\"Country\"},{\"PlaceId\":838,\"Name\":\"Afghanistan\",\"Type\":\"Country\"},{\"PlaceId\":839,\"Name\":\"Antigua and Barbuda\",\"Type\":\"Country\"},{\"PlaceId\":844,\"Name\":\"Albania\",\"Type\":\"Country\"},{\"PlaceId\":845,\"Name\":\"Armenia\",\"Type\":\"Country\"},{\"PlaceId\":847,\"Name\":\"Angola\",\"Type\":\"Country\"},{\"PlaceId\":850,\"Name\":\"Argentina\",\"Type\":\"Country\"},{\"PlaceId\":852,\"Name\":\"Austria\",\"Type\":\"Country\"},{\"PlaceId\":853,\"Name\":\"Australia\",\"Type\":\"Country\"},{\"PlaceId\":855,\"Name\":\"Aruba\",\"Type\":\"Country\"},{\"PlaceId\":858,\"Name\":\"Azerbaijan\",\"Type\":\"Country\"},{\"PlaceId\":881,\"Name\":\"Bosnia and Herzegovina\",\"Type\":\"Country\"},{\"PlaceId\":882,\"Name\":\"Barbados\",\"Type\":\"Country\"},{\"PlaceId\":884,\"Name\":\"Bangladesh\",\"Type\":\"Country\"},{\"PlaceId\":885,\"Name\":\"Belgium\",\"Type\":\"Country\"},{\"PlaceId\":886,\"Name\":\"Burkina Faso\",\"Type\":\"Country\"},{\"PlaceId\":887,\"Name\":\"Bulgaria\",\"Type\":\"Country\"},{\"PlaceId\":888,\"Name\":\"Bahrain\",\"Type\":\"Country\"},{\"PlaceId\":889,\"Name\":\"Burundi\",\"Type\":\"Country\"},{\"PlaceId\":890,\"Name\":\"Benin\",\"Type\":\"Country\"},{\"PlaceId\":893,\"Name\":\"Bermuda\",\"Type\":\"Country\"},{\"PlaceId\":894,\"Name\":\"Brunei\",\"Type\":\"Country\"},{\"PlaceId\":895,\"Name\":\"Bolivia\",\"Type\":\"Country\"},{\"PlaceId\":897,\"Name\":\"Caribbean Netherlands\",\"Type\":\"Country\"},{\"PlaceId\":898,\"Name\":\"Brazil\",\"Type\":\"Country\"},{\"PlaceId\":899,\"Name\":\"Bahamas\",\"Type\":\"Country\"},{\"PlaceId\":903,\"Name\":\"Botswana\",\"Type\":\"Country\"},{\"PlaceId\":905,\"Name\":\"Belarus\",\"Type\":\"Country\"},{\"PlaceId\":906,\"Name\":\"Belize\",\"Type\":\"Country\"},{\"PlaceId\":929,\"Name\":\"Canada\",\"Type\":\"Country\"},{\"PlaceId\":932,\"Name\":\"DR Congo\",\"Type\":\"Country\"},{\"PlaceId\":933,\"Name\":\"Crimea\",\"Type\":\"Country\"},{\"PlaceId\":934,\"Name\":\"Central African Republic\",\"Type\":\"Country\"},{\"PlaceId\":935,\"Name\":\"Congo\",\"Type\":\"Country\"},{\"PlaceId\":936,\"Name\":\"Switzerland\",\"Type\":\"Country\"},{\"PlaceId\":937,\"Name\":\"Ivory Coast\",\"Type\":\"Country\"},{\"PlaceId\":939,\"Name\":\"Cook Islands\",\"Type\":\"Country\"},{\"PlaceId\":940,\"Name\":\"Chile\",\"Type\":\"Country\"},{\"PlaceId\":941,\"Name\":\"Cameroon\",\"Type\":\"Country\"},{\"PlaceId\":942,\"Name\":\"China\",\"Type\":\"Country\"},{\"PlaceId\":943,\"Name\":\"Colombia\",\"Type\":\"Country\"},{\"PlaceId\":946,\"Name\":\"Costa Rica\",\"Type\":\"Country\"},{\"PlaceId\":949,\"Name\":\"Cuba\",\"Type\":\"Country\"},{\"PlaceId\":950,\"Name\":\"Cape Verde\",\"Type\":\"Country\"},{\"PlaceId\":951,\"Name\":\"Curacao\",\"Type\":\"Country\"},{\"PlaceId\":953,\"Name\":\"Cyprus\",\"Type\":\"Country\"},{\"PlaceId\":954,\"Name\":\"Czech Republic\",\"Type\":\"Country\"},{\"PlaceId\":981,\"Name\":\"Germany\",\"Type\":\"Country\"},{\"PlaceId\":986,\"Name\":\"Djibouti\",\"Type\":\"Country\"},{\"PlaceId\":987,\"Name\":\"Denmark\",\"Type\":\"Country\"},{\"PlaceId\":991,\"Name\":\"Dominican Republic\",\"Type\":\"Country\"},{\"PlaceId\":1002,\"Name\":\"Algeria\",\"Type\":\"Country\"},{\"PlaceId\":1027,\"Name\":\"Ecuador\",\"Type\":\"Country\"},{\"PlaceId\":1029,\"Name\":\"Estonia\",\"Type\":\"Country\"},{\"PlaceId\":1031,\"Name\":\"Egypt\",\"Type\":\"Country\"},{\"PlaceId\":1042,\"Name\":\"Eritrea\",\"Type\":\"Country\"},{\"PlaceId\":1043,\"Name\":\"Spain\",\"Type\":\"Country\"},{\"PlaceId\":1044,\"Name\":\"Ethiopia\",\"Type\":\"Country\"},{\"PlaceId\":1081,\"Name\":\"Finland\",\"Type\":\"Country\"},{\"PlaceId\":1082,\"Name\":\"Fiji\",\"Type\":\"Country\"},{\"PlaceId\":1090,\"Name\":\"France\",\"Type\":\"Country\"},{\"PlaceId\":1121,\"Name\":\"Gabon\",\"Type\":\"Country\"},{\"PlaceId\":1124,\"Name\":\"Grenada\",\"Type\":\"Country\"},{\"PlaceId\":1125,\"Name\":\"Georgia\",\"Type\":\"Country\"},{\"PlaceId\":1126,\"Name\":\"French Guiana\",\"Type\":\"Country\"},{\"PlaceId\":1127,\"Name\":\"Guernsey\",\"Type\":\"Country\"},{\"PlaceId\":1128,\"Name\":\"Ghana\",\"Type\":\"Country\"},{\"PlaceId\":1129,\"Name\":\"Gibraltar\",\"Type\":\"Country\"},{\"PlaceId\":1132,\"Name\":\"Greenland\",\"Type\":\"Country\"},{\"PlaceId\":1133,\"Name\":\"Gambia\",\"Type\":\"Country\"},{\"PlaceId\":1134,\"Name\":\"Guinea\",\"Type\":\"Country\"},{\"PlaceId\":1136,\"Name\":\"Guadeloupe\",\"Type\":\"Country\"},{\"PlaceId\":1137,\"Name\":\"Equatorial Guinea\",\"Type\":\"Country\"},{\"PlaceId\":1138,\"Name\":\"Greece\",\"Type\":\"Country\"},{\"PlaceId\":1140,\"Name\":\"Guatemala\",\"Type\":\"Country\"},{\"PlaceId\":1141,\"Name\":\"Guam\",\"Type\":\"Country\"},{\"PlaceId\":1143,\"Name\":\"Guinea-Bissau\",\"Type\":\"Country\"},{\"PlaceId\":1179,\"Name\":\"Hong Kong\",\"Type\":\"Country\"},{\"PlaceId\":1182,\"Name\":\"Honduras\",\"Type\":\"Country\"},{\"PlaceId\":1186,\"Name\":\"Croatia\",\"Type\":\"Country\"},{\"PlaceId\":1188,\"Name\":\"Haiti\",\"Type\":\"Country\"},{\"PlaceId\":1189,\"Name\":\"Hungary\",\"Type\":\"Country\"},{\"PlaceId\":1220,\"Name\":\"Indonesia\",\"Type\":\"Country\"},{\"PlaceId\":1221,\"Name\":\"Ireland\",\"Type\":\"Country\"},{\"PlaceId\":1228,\"Name\":\"Israel\",\"Type\":\"Country\"},{\"PlaceId\":1230,\"Name\":\"India\",\"Type\":\"Country\"},{\"PlaceId\":1233,\"Name\":\"Iraq\",\"Type\":\"Country\"},{\"PlaceId\":1234,\"Name\":\"Iran\",\"Type\":\"Country\"},{\"PlaceId\":1235,\"Name\":\"Iceland\",\"Type\":\"Country\"},{\"PlaceId\":1236,\"Name\":\"Italy\",\"Type\":\"Country\"},{\"PlaceId\":1277,\"Name\":\"Jamaica\",\"Type\":\"Country\"},{\"PlaceId\":1279,\"Name\":\"Jordan\",\"Type\":\"Country\"},{\"PlaceId\":1280,\"Name\":\"Japan\",\"Type\":\"Country\"},{\"PlaceId\":1317,\"Name\":\"Kenya\",\"Type\":\"Country\"},{\"PlaceId\":1319,\"Name\":\"Kyrgyzstan\",\"Type\":\"Country\"},{\"PlaceId\":1320,\"Name\":\"Cambodia\",\"Type\":\"Country\"},{\"PlaceId\":1326,\"Name\":\"Saint Kitts and Nevis\",\"Type\":\"Country\"},{\"PlaceId\":1327,\"Name\":\"Kosovo\",\"Type\":\"Country\"},{\"PlaceId\":1330,\"Name\":\"South Korea\",\"Type\":\"Country\"},{\"PlaceId\":1335,\"Name\":\"Kuwait\",\"Type\":\"Country\"},{\"PlaceId\":1337,\"Name\":\"Cayman Islands\",\"Type\":\"Country\"},{\"PlaceId\":1338,\"Name\":\"Kazakhstan\",\"Type\":\"Country\"},{\"PlaceId\":1361,\"Name\":\"Laos\",\"Type\":\"Country\"},{\"PlaceId\":1362,\"Name\":\"Lebanon\",\"Type\":\"Country\"},{\"PlaceId\":1363,\"Name\":\"Saint Lucia\",\"Type\":\"Country\"},{\"PlaceId\":1371,\"Name\":\"Sri Lanka\",\"Type\":\"Country\"},{\"PlaceId\":1378,\"Name\":\"Liberia\",\"Type\":\"Country\"},{\"PlaceId\":1379,\"Name\":\"Lesotho\",\"Type\":\"Country\"},{\"PlaceId\":1380,\"Name\":\"Lithuania\",\"Type\":\"Country\"},{\"PlaceId\":1381,\"Name\":\"Luxembourg\",\"Type\":\"Country\"},{\"PlaceId\":1382,\"Name\":\"Latvia\",\"Type\":\"Country\"},{\"PlaceId\":1385,\"Name\":\"Libya\",\"Type\":\"Country\"},{\"PlaceId\":1409,\"Name\":\"Morocco\",\"Type\":\"Country\"},{\"PlaceId\":1412,\"Name\":\"Moldova\",\"Type\":\"Country\"},{\"PlaceId\":1413,\"Name\":\"Montenegro\",\"Type\":\"Country\"},{\"PlaceId\":1415,\"Name\":\"Madagascar\",\"Type\":\"Country\"},{\"PlaceId\":1419,\"Name\":\"Republic of Macedonia\",\"Type\":\"Country\"},{\"PlaceId\":1420,\"Name\":\"Mali\",\"Type\":\"Country\"},{\"PlaceId\":1421,\"Name\":\"Myanmar\",\"Type\":\"Country\"},{\"PlaceId\":1422,\"Name\":\"Mongolia\",\"Type\":\"Country\"},{\"PlaceId\":1423,\"Name\":\"Macau\",\"Type\":\"Country\"},{\"PlaceId\":1424,\"Name\":\"Northern Mariana Islands\",\"Type\":\"Country\"},{\"PlaceId\":1425,\"Name\":\"Martinique\",\"Type\":\"Country\"},{\"PlaceId\":1426,\"Name\":\"Mauritania\",\"Type\":\"Country\"},{\"PlaceId\":1428,\"Name\":\"Malta\",\"Type\":\"Country\"},{\"PlaceId\":1429,\"Name\":\"Mauritius\",\"Type\":\"Country\"},{\"PlaceId\":1430,\"Name\":\"Maldives\",\"Type\":\"Country\"},{\"PlaceId\":1431,\"Name\":\"Malawi\",\"Type\":\"Country\"},{\"PlaceId\":1432,\"Name\":\"Mexico\",\"Type\":\"Country\"},{\"PlaceId\":1433,\"Name\":\"Malaysia\",\"Type\":\"Country\"},{\"PlaceId\":1434,\"Name\":\"Mozambique\",\"Type\":\"Country\"},{\"PlaceId\":1457,\"Name\":\"Namibia\",\"Type\":\"Country\"},{\"PlaceId\":1459,\"Name\":\"New Caledonia\",\"Type\":\"Country\"},{\"PlaceId\":1461,\"Name\":\"Niger\",\"Type\":\"Country\"},{\"PlaceId\":1463,\"Name\":\"Nigeria\",\"Type\":\"Country\"},{\"PlaceId\":1465,\"Name\":\"Nicaragua\",\"Type\":\"Country\"},{\"PlaceId\":1468,\"Name\":\"Netherlands\",\"Type\":\"Country\"},{\"PlaceId\":1471,\"Name\":\"Norway\",\"Type\":\"Country\"},{\"PlaceId\":1472,\"Name\":\"Nepal\",\"Type\":\"Country\"},{\"PlaceId\":1482,\"Name\":\"New Zealand\",\"Type\":\"Country\"},{\"PlaceId\":1517,\"Name\":\"Oman\",\"Type\":\"Country\"},{\"PlaceId\":1553,\"Name\":\"Panama\",\"Type\":\"Country\"},{\"PlaceId\":1557,\"Name\":\"Peru\",\"Type\":\"Country\"},{\"PlaceId\":1558,\"Name\":\"French Polynesia\",\"Type\":\"Country\"},{\"PlaceId\":1559,\"Name\":\"Papua New Guinea\",\"Type\":\"Country\"},{\"PlaceId\":1560,\"Name\":\"Philippines\",\"Type\":\"Country\"},{\"PlaceId\":1563,\"Name\":\"Pakistan\",\"Type\":\"Country\"},{\"PlaceId\":1564,\"Name\":\"Poland\",\"Type\":\"Country\"},{\"PlaceId\":1570,\"Name\":\"Puerto Rico\",\"Type\":\"Country\"},{\"PlaceId\":1572,\"Name\":\"Portugal\",\"Type\":\"Country\"},{\"PlaceId\":1575,\"Name\":\"Palau\",\"Type\":\"Country\"},{\"PlaceId\":1577,\"Name\":\"Paraguay\",\"Type\":\"Country\"},{\"PlaceId\":1601,\"Name\":\"Qatar\",\"Type\":\"Country\"},{\"PlaceId\":1653,\"Name\":\"Reunion\",\"Type\":\"Country\"},{\"PlaceId\":1663,\"Name\":\"Romania\",\"Type\":\"Country\"},{\"PlaceId\":1667,\"Name\":\"Serbia\",\"Type\":\"Country\"},{\"PlaceId\":1669,\"Name\":\"Russia\",\"Type\":\"Country\"},{\"PlaceId\":1671,\"Name\":\"Rwanda\",\"Type\":\"Country\"},{\"PlaceId\":1697,\"Name\":\"Saudi Arabia\",\"Type\":\"Country\"},{\"PlaceId\":1698,\"Name\":\"Solomon Islands\",\"Type\":\"Country\"},{\"PlaceId\":1699,\"Name\":\"Seychelles\",\"Type\":\"Country\"},{\"PlaceId\":1700,\"Name\":\"Sudan\",\"Type\":\"Country\"},{\"PlaceId\":1701,\"Name\":\"Sweden\",\"Type\":\"Country\"},{\"PlaceId\":1703,\"Name\":\"Singapore\",\"Type\":\"Country\"},{\"PlaceId\":1705,\"Name\":\"Slovenia\",\"Type\":\"Country\"},{\"PlaceId\":1707,\"Name\":\"Slovakia\",\"Type\":\"Country\"},{\"PlaceId\":1708,\"Name\":\"Sierra Leone\",\"Type\":\"Country\"},{\"PlaceId\":1710,\"Name\":\"Senegal\",\"Type\":\"Country\"},{\"PlaceId\":1711,\"Name\":\"Somalia\",\"Type\":\"Country\"},{\"PlaceId\":1714,\"Name\":\"Suriname\",\"Type\":\"Country\"},{\"PlaceId\":1715,\"Name\":\"South Sudan\",\"Type\":\"Country\"},{\"PlaceId\":1716,\"Name\":\"Sao Tome and Principe\",\"Type\":\"Country\"},{\"PlaceId\":1718,\"Name\":\"El Salvador\",\"Type\":\"Country\"},{\"PlaceId\":1720,\"Name\":\"St Maarten\",\"Type\":\"Country\"},{\"PlaceId\":1721,\"Name\":\"Syria\",\"Type\":\"Country\"},{\"PlaceId\":1747,\"Name\":\"Turks and Caicos Islands\",\"Type\":\"Country\"},{\"PlaceId\":1748,\"Name\":\"Chad\",\"Type\":\"Country\"},{\"PlaceId\":1751,\"Name\":\"Togo\",\"Type\":\"Country\"},{\"PlaceId\":1752,\"Name\":\"Thailand\",\"Type\":\"Country\"},{\"PlaceId\":1754,\"Name\":\"Tajikistan\",\"Type\":\"Country\"},{\"PlaceId\":1757,\"Name\":\"Turkmenistan\",\"Type\":\"Country\"},{\"PlaceId\":1758,\"Name\":\"Tunisia\",\"Type\":\"Country\"},{\"PlaceId\":1762,\"Name\":\"Turkey\",\"Type\":\"Country\"},{\"PlaceId\":1764,\"Name\":\"Trinidad and Tobago\",\"Type\":\"Country\"},{\"PlaceId\":1767,\"Name\":\"Taiwan\",\"Type\":\"Country\"},{\"PlaceId\":1770,\"Name\":\"Tanzania\",\"Type\":\"Country\"},{\"PlaceId\":1793,\"Name\":\"Ukraine\",\"Type\":\"Country\"},{\"PlaceId\":1799,\"Name\":\"Uganda\",\"Type\":\"Country\"},{\"PlaceId\":1803,\"Name\":\"United Kingdom\",\"Type\":\"Country\"},{\"PlaceId\":1811,\"Name\":\"United States\",\"Type\":\"Country\"},{\"PlaceId\":1817,\"Name\":\"Uruguay\",\"Type\":\"Country\"},{\"PlaceId\":1818,\"Name\":\"Uzbekistan\",\"Type\":\"Country\"},{\"PlaceId\":1845,\"Name\":\"Venezuela\",\"Type\":\"Country\"},{\"PlaceId\":1847,\"Name\":\"British Virgin Islands\",\"Type\":\"Country\"},{\"PlaceId\":1849,\"Name\":\"Virgin Islands\",\"Type\":\"Country\"},{\"PlaceId\":1854,\"Name\":\"Vietnam\",\"Type\":\"Country\"},{\"PlaceId\":1989,\"Name\":\"Yemen\",\"Type\":\"Country\"},{\"PlaceId\":2004,\"Name\":\"Mayotte\",\"Type\":\"Country\"},{\"PlaceId\":2033,\"Name\":\"South Africa\",\"Type\":\"Country\"},{\"PlaceId\":2045,\"Name\":\"Zambia\",\"Type\":\"Country\"},{\"PlaceId\":2055,\"Name\":\"Zimbabwe\",\"Type\":\"Country\"},{\"PlaceId\":40830,\"IataCode\":\"ARN\",\"Name\":\"Stockholm Arlanda\",\"Type\":\"Station\",\"CityName\":\"Stockholm\",\"CityId\":\"STOC\",\"CountryName\":\"Sweden\"},{\"PlaceId\":42607,\"IataCode\":\"BGO\",\"Name\":\"Bergen\",\"Type\":\"Station\",\"CityName\":\"Bergen\",\"CityId\":\"BERI\",\"CountryName\":\"Norway\"},{\"PlaceId\":45336,\"IataCode\":\"CPH\",\"Name\":\"Copenhagen\",\"Type\":\"Station\",\"CityName\":\"Copenhagen\",\"CityId\":\"COPE\",\"CountryName\":\"Denmark\"},{\"PlaceId\":54416,\"IataCode\":\"GMP\",\"Name\":\"Seoul Gimpo\",\"Type\":\"Station\",\"CityName\":\"Seoul\",\"CityId\":\"SELA\",\"CountryName\":\"South Korea\"},{\"PlaceId\":54833,\"IataCode\":\"GVA\",\"Name\":\"Geneva\",\"Type\":\"Station\",\"CityName\":\"Geneva\",\"CityId\":\"GENE\",\"CountryName\":\"Switzerland\"},{\"PlaceId\":56615,\"IataCode\":\"HKG\",\"Name\":\"Hong Kong International\",\"Type\":\"Station\",\"CityName\":\"Hong Kong\",\"CityId\":\"HKGA\",\"CountryName\":\"Hong Kong\"},{\"PlaceId\":58542,\"IataCode\":\"ICN\",\"Name\":\"Seoul Incheon Int'l\",\"Type\":\"Station\",\"CityName\":\"Seoul\",\"CityId\":\"SELA\",\"CountryName\":\"South Korea\"},{\"PlaceId\":63238,\"IataCode\":\"KEF\",\"Name\":\"Reykjavik Keflavik\",\"Type\":\"Station\",\"CityName\":\"Reykjavik\",\"CityId\":\"REYK\",\"CountryName\":\"Iceland\"},{\"PlaceId\":65655,\"IataCode\":\"LGW\",\"Name\":\"London Gatwick\",\"Type\":\"Station\",\"CityName\":\"London\",\"CityId\":\"LOND\",\"CountryName\":\"United Kingdom\"},{\"PlaceId\":65698,\"IataCode\":\"LHR\",\"Name\":\"London Heathrow\",\"Type\":\"Station\",\"CityName\":\"London\",\"CityId\":\"LOND\",\"CountryName\":\"United Kingdom\"},{\"PlaceId\":65747,\"IataCode\":\"LIS\",\"Name\":\"Lisbon\",\"Type\":\"Station\",\"CityName\":\"Lisbon\",\"CityId\":\"LISB\",\"CountryName\":\"Portugal\"},{\"PlaceId\":66270,\"IataCode\":\"LTN\",\"Name\":\"London Luton\",\"Type\":\"Station\",\"CityName\":\"London\",\"CityId\":\"LOND\",\"CountryName\":\"United Kingdom\"},{\"PlaceId\":74763,\"IataCode\":\"PEK\",\"Name\":\"Beijing Capital\",\"Type\":\"Station\",\"CityName\":\"Beijing\",\"CityId\":\"BJSA\",\"CountryName\":\"China\"},{\"PlaceId\":75383,\"IataCode\":\"PRG\",\"Name\":\"Prague\",\"Type\":\"Station\",\"CityName\":\"Prague\",\"CityId\":\"PRAG\",\"CountryName\":\"Czech Republic\"},{\"PlaceId\":75575,\"IataCode\":\"PVG\",\"Name\":\"Shanghai Pu Dong\",\"Type\":\"Station\",\"CityName\":\"Shanghai\",\"CityId\":\"CSHA\",\"CountryName\":\"China\"},{\"PlaceId\":79179,\"IataCode\":\"RAK\",\"Name\":\"Marrakech Menara\",\"Type\":\"Station\",\"CityName\":\"Marrakech Menara\",\"CityId\":\"MARR\",\"CountryName\":\"Morocco\"},{\"PlaceId\":81678,\"IataCode\":\"SEN\",\"Name\":\"London Southend\",\"Type\":\"Station\",\"CityName\":\"London\",\"CityId\":\"LOND\",\"CountryName\":\"United Kingdom\"},{\"PlaceId\":82398,\"IataCode\":\"STN\",\"Name\":\"London Stansted\",\"Type\":\"Station\",\"CityName\":\"London\",\"CityId\":\"LOND\",\"CountryName\":\"United Kingdom\"},{\"PlaceId\":3169460,\"IataCode\":\"LON\",\"Name\":\"London\",\"Type\":\"City\",\"CityName\":\"London\",\"CityId\":\"LOND\"}]}")
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
                if (index >= ref_obj[0]['Quotes'].length) {
                    return new_obj;
                }
                if (ref_obj[0]['Quotes'] == '[]') {
                    return false;
                }
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
                    new_obj['places'] = ref_obj[0]['Places'];
                    for (var i = 1; i < Object.keys(ref_obj).length; i++) {
                        var quote = filterObjByContaining (ref_obj[i]['Quotes'],'OutboundLeg', 'DestinationId', destination_id);
                        if (quote) {
                            new_obj['dest_quotes'][i] = null;
                            new_obj['absence_flag'] = true;
                        } else {
                            new_obj['dest_quotes'][i] = quote[0];
                            new_obj['places'][i] = ref_obj[i]['Places']
                            new_obj['total_price'] += quote[0].MinPrice;
                        }
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