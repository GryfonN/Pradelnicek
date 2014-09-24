'use strict';

var pradelnicekFilters = angular.module('pradelnicek.Filters', []);

pradelnicekFilters.filter('reverseArray', function () {
    return function (items) {
        return items.slice().reverse();
    };
});