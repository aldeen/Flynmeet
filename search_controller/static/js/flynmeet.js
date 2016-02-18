(function () {
  'use strict';

    angular
        .module('flynmeet', [
          'flynmeet.routes',
          'flynmeet.search_controller',
          'flynmeet.config', 'ngRoute',
        ])
    .run(run);

    run.$inject = ['$http'];

    angular
        .module('flynmeet.config', []);

    angular
        .module('flynmeet.routes', ['ngRoute']);

    /**
    * @name run
    * @desc Update xsrf $http headers to align with Django's defaults
    */
    function run($http) {
        $http.defaults.xsrfHeaderName = 'X-CSRFToken';
        $http.defaults.xsrfCookieName = 'csrftoken';
        /*$http.defaults.headers.common['X-CSRFToken'] = $cookies['csrftoken'];*/
    }
})();




