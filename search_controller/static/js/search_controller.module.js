/**
* search_controller module
* @namespace flynmeet.search_controller
*/
(function () {
  'use strict';

  angular
    .module('flynmeet.search_controller', ['ngMaterial',
        'flynmeet.search_controller.controllers',
        'flynmeet.search_controller.services'
    ]);

  angular
    .module('flynmeet.search_controller.controllers', []);

  angular
    .module('flynmeet.search_controller.services', ['ngCookies']);
})();