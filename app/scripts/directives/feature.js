angular.module('statusieApp')
    .directive('feature', function () {
        return {
            templateUrl: '/templates/feature.html',
            restrict: 'E',
            replace: true,
            controller: function ($scope, $location) {
                'use strict';
                $scope.$on('filtersUpdated', function () {
                    $scope.show = false;
                });

                var id = $location.path();
                if (id === '/' + $scope.feature.normalized_name) {
                    $scope.show = true;
                }

                $scope.updateLocation = function (location) {
                    $location.path(location);
                };
            },
            link: function postLink(scope, element) {
                //The following code is for accessibility
                //We do it by code instead of binds because it will add lots of watchers and we will be over the
                //recommended number
                var feature = element[0];
                var header = feature.querySelector('button');
                var headerOffsetHeight = header.offsetHeight;
                var featureWrapper = feature.querySelector('.feature-body-wrapper');

                var autoHeight = function () {
                    feature.style.height = "auto";
                    feature.removeEventListener('transitionend', autoHeight);
                };

                scope.$watch('show', function (newValue) {
                    if (newValue) {
                        header.setAttribute('aria-expanded', 'true');
                        featureWrapper.setAttribute('aria-hidden', 'false');
                    } else {
                        header.setAttribute('aria-expanded', 'false');
                        featureWrapper.setAttribute('aria-hidden', 'true');
                    }
                });

                scope.expand = function () {
                    scope.show = !scope.show;
                    if (scope.show) {
                        featureWrapper.style.display = "block";
                        feature.style.height = (featureWrapper.offsetHeight + 40) + "px";
                        feature.addEventListener('transitionend', autoHeight);
                        scope.updateLocation('/' + scope.feature.normalized_name);
                    } else {
                        featureWrapper.style.display = "none";
                        feature.style.height = headerOffsetHeight + "px";
                    }
                };

                header.addEventListener('focus', function () {
                    header.setAttribute('aria-selected', 'true');
                });

                header.addEventListener('blur', function () {
                    header.setAttribute('aria-selected', 'false');
                });
            }
        };
    });