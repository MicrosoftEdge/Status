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
            },
            link : function postLink(scope, element){
                //The following code is for accessibility
                //We do it by code instead of binds because it will add lots of watchers and we will be over the
                //recommended number
                var feature = element[0];
                var header = feature.querySelector('button');
                var headerHeight = header.offsetHeight;
                var featureWrapper = feature.querySelector('.feature-body-wrapper');
                scope.$watch('show', function(newValue){
                    if(newValue){
                        header.setAttribute('aria-expanded','true');
                        featureWrapper.setAttribute('aria-hidden','false');
                    }else{
                        header.setAttribute('aria-expanded','false');
                        featureWrapper.setAttribute('aria-hidden','true');
                    }
                });

                scope.expand = function () {
                    scope.show = !scope.show;
                    if (scope.show) {
                        featureWrapper.style.display = "block";
                        element.style.height = (featureWrapper.offsetHeight + 30) + "px";
                        featureWrapper.style.height = "auto";
                    } else {
                        featureWrapper.style.display = "none";
                        element.style.height = headerHeight + "px";
                    }
                };

                header.addEventListener('focus', function(){
                    header.setAttribute('aria-selected', 'true');
                });

                header.addEventListener('blur', function(){
                    header.setAttribute('aria-selected', 'false');
                });
            }
        };
    });