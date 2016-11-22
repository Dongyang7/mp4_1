var app = angular.module('mp4', ['ngRoute', 'mp4Controllers', 'mp4Services','720kb.datepicker']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
/*    when('/firstview', {
    templateUrl: 'partials/firstview.html',
    controller: 'FirstController'
  }).
  when('/secondview', {
    templateUrl: 'partials/secondview.html',
    controller: 'SecondController'
  }).
    when('/llamalist', {
    templateUrl: 'partials/llamalist.html',
    controller: 'LlamaListController'
  }).*/
  when('/settings', {
    templateUrl: 'partials/settings.html',
    controller: 'settingsController'
  }).
  when('/adduser', {
    templateUrl: 'partials/adduser.html',
    controller: 'adduserController'
  }).
  when('/userdetail/:_id', {
    templateUrl: 'partials/userdetail.html',
    controller: 'userdetailController'
  }).
  when('/userlist', {
    templateUrl: 'partials/userlist.html',
    controller: 'userlistController'
  }).
  when('/addtask', {
    templateUrl: 'partials/addtask.html',
    controller: 'addtaskController'
  }).
  when('/tasklist', {
    templateUrl: 'partials/tasklist.html',
    controller: 'tasklistController'
  }).
  when('/taskdetail/:_id', {
    templateUrl: 'partials/taskdetail.html',
    controller: 'taskdetailController'
  }).
  when('/edittask/:_id', {
    templateUrl: 'partials/edittask.html',
    controller: 'edittaskController'
  }).
  otherwise({
    redirectTo: '/settings'
  });
}]);
