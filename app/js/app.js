'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
    'pradelnicek.Services',
    'pradelnicek.Controllers',
    'pradelnicek.Filters',
    'pradelnicek.Factories',
    'ngRoute'
]).
    config(['$routeProvider', function ($routeProvider) {
//        $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl1'});
//        $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
//        $routeProvider.otherwise({redirectTo: '/view1'});
        $routeProvider.when('/test', {templateUrl: 'partials/tester.html', controller: 'ClothesSorterCtrl'});
        $routeProvider.when('/wash', {templateUrl: 'partials/washmachine.html', controller: 'WashmachineCtrl'});
        $routeProvider.otherwise({redirectTo: '/wash'});
    }]);
