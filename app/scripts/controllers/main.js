angular.module('statusieApp')
    .controller('MainCtrl', function ($scope, Status) {
        'use strict';

        Status.load()
            .then(function (data) {
                $scope.chromeStatus = data;
            });

        $scope.tableClass = function (feature) {
            if (feature.ie_status && feature.ie_status !== feature.ie_views.value) {
                return "danger";
            } else if (feature.ie_views.value == 1) {
                if (feature.impl_status_chrome == 'Enabled by default') return "success";
                return feature.impl_status_chrome == 'No longer pursuing' ? "danger" : "info";
            } else if (feature.ie_views.value == 5) {
                return "warning";
            }
            return "";
        };

        $scope.standardClass = function (feature) {
            if (feature.standardization.value == 1) return "text-warning";
            if (feature.standardization.value == 2) return "text-success";
            if (feature.standardization.value == 6) return "text-danger";
            return "";
        };

//        statusFactory.getChromeStatus().success(function(data) {
//            //Trim category names into CSS classes
//            data.forEach(function(item) {
//                item.category = item.category.replace(/[^a-zA-Z0-9]/g,''); //Remove Whitespace
//            });
//            $scope.chromeStatus = data;
//            statusFactory.mergeStatus($scope.chromeStatus,IE_STATUS);
//        });
    });
