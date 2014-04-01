angular.module('statusieApp')
    .directive('notmobile', function () {
        'use strict';
        return {
            restrict: 'A',
            priority: 10000,
            transclude: 'element',
            link: function ($scope, element, attributes, nullController, transclude) {
                var transcludeElement = function (){
                    transclude($scope, function (clone) {
                        element.after(clone);
                    });
                };

                if(window.matchMedia) {
                    var medias = window.matchMedia('only screen and (min-device-width: 320px) and (max-device-width: 568px').matches ||
                        window.matchMedia('only screen and (min-device-width: 320px) and (max-device-width: 480px').matches ||
                        window.matchMedia('only screen and (min-resolution: 192dpi').matches ||
                        !!navigator.userAgent.match(/IEMobile\/10\.0/); //We need to do browser detection because of the viewport issue pre GDR3 :(

                    if (!medias) {
                        transcludeElement();
                    }
                }else{
                    transcludeElement();
                }
            }
        };
    });
