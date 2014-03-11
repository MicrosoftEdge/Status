'use strict';

describe('Directive: featuresorting', function () {

  // load the directive's module
  beforeEach(module('statusieApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<featuresorting></featuresorting>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the featuresorting directive');
  }));
});
