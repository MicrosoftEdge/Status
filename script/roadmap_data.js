var chromeStatusURL = "http://www.chromestatus.com/features.json";
var app = angular.module('statusApp', []);
app.controller('statusController', function($scope,chromeStatusFactory) {
    function init() {
        chromeStatusFactory.getChromeStatus().success(function(data) {
            data.forEach(function(item) {
                item.category = item.category.replace(/[^a-zA-Z0-9]/g,''); //Remove Whitespace
            });
            $scope.chromeStatus = data;
        });
    }
    init();
});
app.factory('chromeStatusFactory',function($http) {
    var factory = {};
    factory.getChromeStatus = function() {
        return $http.get(chromeStatusURL);
    };
    return factory;
});