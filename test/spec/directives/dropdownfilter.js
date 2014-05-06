'use strict';

describe('Directive: drowpdownfilter', function () {

  // load the directive's module
  beforeEach(module('statusieApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<drowpdownfilter></drowpdownfilter>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the drowpdownfilter directive');
  }));
});
