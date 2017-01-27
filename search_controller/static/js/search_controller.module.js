/**
 * search_controller module
 * @namespace flynmeet.search_controller
 */
(function () {
    'use strict';

    angular
        .module('flynmeet.search_controller', ['ngMaterial',
        'flynmeet.search_controller.controllers',
        'flynmeet.search_controller.services',
        'flynmeet.search_controller.directives',
    ]);

    angular
        .module('flynmeet.search_controller.controllers', []);

    angular
        .module('flynmeet.search_controller.services', ['ngCookies']);

    angular
        .module('flynmeet.search_controller.directives', []);
})();