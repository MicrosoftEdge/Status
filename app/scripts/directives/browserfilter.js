'use strict';

angular.module('statusieApp')
  .directive('browserfilter', function () {
      return {
          templateUrl: '/templates/browserfilter.html',
          //template: '<div></div>',
          restrict: 'E',
          link: function postLink(scope, element, attrs) {
              element.text('this is the browserfilter directive');
          }
      };
  });
