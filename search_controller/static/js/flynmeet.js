angular
  .module('Flynmeet', [
    'flynmeet.config',
    // ...
  ]);

angular
  .module('flynmeet.config', []);


(function () {
  'use strict';

  angular
    .module('Flynmeet', [
      'flynmeet.routes',
      'flynmeet.search_controller'
    ]);

  angular
    .module('flynmeet.routes', ['ngRoute']);
})();




angular
  .module('Flynmeet')
  .run(run);

run.$inject = ['$http'];

/**
* @name run
* @desc Update xsrf $http headers to align with Django's defaults
*/
function run($http) {
    $http.defaults.xsrfHeaderName = 'X-CSRFToken';
    $http.defaults.xsrfCookieName = 'csrftoken';
    /*$http.defaults.headers.common['X-CSRFToken'] = $cookies['csrftoken'];*/
}