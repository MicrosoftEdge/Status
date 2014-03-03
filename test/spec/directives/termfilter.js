'use strict';

describe('Directive: termFilter', function () {

  // load the directive's module
  beforeEach(module('statusieApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<term-filter></term-filter>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the termFilter directive');
  }));
});
