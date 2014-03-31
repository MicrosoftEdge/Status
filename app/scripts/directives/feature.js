'use strict';

angular.module('statusieApp')
    .directive('feature', function () {
        return {
            templateUrl: '/templates/feature.html',
            restrict: 'E',
            replace: true,
            link: function (scope, element, attrs) {
//                var featureName = $(element).find('h1.feature_name');
//                var featureInfoWidth = $(element).find('.feature-info').width();
//                featureName.css('max-width', 'calc(100% - ' + (featureInfoWidth + 10) + 'px)');
            }
        };
    });
