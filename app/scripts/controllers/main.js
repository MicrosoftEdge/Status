angular.module('statusieApp')
  .controller('MainCtrl', function ($scope, $http) {
        'use strict';

        var chromeStatusURL = 'http://www.chromestatus.com/features.json';

        $http.get(chromeStatusURL).success(function(data) {
            data.forEach(function(item) {
                item.category = item.category.replace(/[^a-zA-Z0-9]/g,''); //Remove Whitespace
            });
            $scope.chromeStatus = data;
        });
  });
