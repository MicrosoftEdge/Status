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

                $scope.expand = function () {
                    $scope.show = !$scope.show;
                    if ($scope.show) {
                        $location.path('/' + $scope.feature.normalized_name);
                    }
                };

                var id = $location.path();
                if (id === '/' + $scope.feature.normalized_name) {
                    $scope.show = true;
                }
            },
            link : function postLink(scope, element){
                //The following code is for accesibility
                //We do it by code instead of binds because it will add lots of watchers and we will be over the
                //recommended number
                var header = element[0].querySelector('header');
                var featureWrapper = element[0].querySelector('.feature-body-wrapper');
                scope.$watch('show', function(newValue, oldValue){
                    if(newValue){
                        header.setAttribute('aria-expanded','true');
                        featureWrapper.setAttribute('aria-hidden','false');
                    }else{
                        header.setAttribute('aria-expanded','false');
                        featureWrapper.setAttribute('aria-hidden','true');
                    }
                });

            }
        };
    });
