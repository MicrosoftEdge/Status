// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the Apache License, Version 2.0 (the "License"); you may not use these files except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
angular.module('statusieApp')
  .directive('drowpdownfilter', function () {
    return {
      templateUrl: '/templates/dropdownfilter.html',
      restrict: 'E',
      scope: {
        options: '='
      },
      priority: 10,
      replace: true,
      controller: function ($location, $scope) {
        'use strict';

        var filterFunction = function (selectedCategories) {
          return function (acum, item) {
            if (selectedCategories && selectedCategories.length === 0) {
              acum.push(item);
            } else if (_.contains(selectedCategories, item.category)) {
              acum.push(item);
            }

            return acum;
          }
        };

        var cat = $location.search()['technology'];

        $scope.$watch('selections', function (newValue, oldValue) {
          if (!newValue) {
            return;
          }

          //We don't want to filter when we add the categories
          if (!oldValue && !cat) {
            return;
          }

          var selectedCategories = _.sortBy(_.pluck(_.filter(newValue, function (category) {
            if (cat) {
              return category.name.replace(' ','').toLowerCase() === cat;
            } else {
              return category.selected;
            }
          }), 'name'), _.identity);

          $scope.$emit('filterupdated', {
            name: 'category',
            filterFunction: filterFunction(selectedCategories)
          });

        }, true);

        $scope.$watch('options.selections', function (newValue, oldValue) {
          if (!newValue) {
            return;
          }

          if (newValue && !oldValue) {
            //We need to assign it at this moment because if not the dropdown is not populated
            $scope.selections = newValue;
            $scope.allOptions = true;
          }
        }, true);

        $scope.selectAll = function (evt) {
          if (evt.target.tagName.toLowerCase() === 'input') {
            $scope.allOptions = !$scope.allOptions;
          }
          evt.stopPropagation();
        };


      },
      link: function postLink(scope, element, attrs) {
        //find in jqLite only supports tagname search
        element.find('ul').on('click', function (evt) {
          var tagName = evt.target.tagName.toLowerCase();
          var classList = evt.target.parentElement.classList;
          if (tagName === 'label') {
            if (classList.contains('dynamic-option')) {
              scope.$apply(function () {
                if (scope.allOptions) {
                  scope.allOptions = false;
                }
              });
            } else if (classList.contains('dynamic-all')) {
              scope.$apply(function () {
                scope.allOptions = !scope.allOptions;
                if (scope.allOptions) {
                  _.forEach(scope.options.selections, function (option) {
                    option.selected = false;
                  });
                }
              });
            }
            evt.stopPropagation();
          } else if (tagName === 'input') {
            if (evt.target.parentElement.parentElement.classList.contains('dynamic-all')) {
              scope.$apply(function () {
                scope.allOptions = !scope.allOptions;
                if (scope.allOptions) {
                  _.forEach(scope.options.selections, function (option) {
                    option.selected = false;
                  });
                }
              });
            }
            evt.stopPropagation();
          }
        });
      }
    };
  });
