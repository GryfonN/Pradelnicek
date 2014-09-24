'use strict';

/* Services */

var pradelnicekServices = angular.module('pradelnicek.Services', ['ngResource']);

pradelnicekServices.factory('pClothes',
    ['$resource', function ($resources) {
        return $resources(
            'data/clothes/clothes.json',
            {}
        );
    }]
);
