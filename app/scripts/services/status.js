'use strict';

angular.module('statusieApp')
    .service('Status', ['$http', '$q', function Status($http, $q) {
        //We can load it locally using /static/features.json
        var chromeStatusURL = 'http://www.chromestatus.com/features.json';

        //TODO: load this from a remote url
        var ieStatusURL = '/static/ie-status.json';
        var observedBrowsers = _.map(['Internet Explorer', 'Chrome', 'Firefox', 'Safari', 'Opera'], function (browser) {
            return {name: browser, selected: false};
        });
        var ieVersions = _.map(['IE6+', 'IE7+', 'IE8+', 'IE9+', 'IE10+', 'IE11+'], function (version) {
            return {name: version, selected: false};
        });
        var chromeStatus;
        var ieStatus;
        var categories;

        var getChromeStatus = function () {
            return $http.get(chromeStatusURL).then(function (response) {
                var data = response.data;
                var tempCategories = {};

                chromeStatus = {};

                _.forEach(data, function (item) {
//                    item.category = item.category.replace(/[^a-zA-Z0-9]/g, ''); //Remove Whitespace
                    chromeStatus[item.name] = item;
                    tempCategories[item.category] = {
                        name: item.category,
                        selected: false
                    };
                });

                categories = _.toArray(tempCategories);

                return chromeStatus;
            });
        };

        var getIEStatus = function () {
            return $http.get(ieStatusURL).then(function (response) {
                ieStatus = response.data;
                return ieStatus;
            });
        };

        var mergeData = function () {
            var deferred = $q.defer();

            setTimeout(function () {

                var specFinder = function (spec) {
                    if (!spec) {
                        return '';
                    } else if (_.contains(spec, 'w3.org')) {
                        return 'W3C';
                    } else if (_.contains(spec, 'ecmascript.org')) {
                        return 'ECMA';
                    } else if (_.contains(spec, 'khronos.org')) {
                        return 'Khronos';
                    } else if (_.contains(spec, 'whatwg.org')) {
                        return 'whatwg';
                    } else if (_.contains(spec, 'xiph.org')) {
                        return 'XIPH';
                    } else if (_.contains(spec, 'ietf.org')) {
                        return 'IETF';
                    } else {
                        return '';
                    }
                    //TODO: Complete with all the organizations
                };

                var iePositions = {
                    1: (Math.ceil(Math.random() * 6) + 5) + '+', //This should be the real IE version
                    2: "In Development",
                    3: "Investigating",
                    5: "Opposed"
                };

                var mergedData = _.map(chromeStatus, function (feature) {
                    if (ieStatus[feature.name]) {
                        feature.ie_status = ieStatus[feature.name];
                    }

                    var transformedFeature = {
                        name: feature.name,
                        summary: feature.summary,
                        category: feature.category,
                        normalized_category: feature.category.replace(/[^a-zA-Z0-9]/g, '').toLowerCase(),
                        position: iePositions[(feature.ie_status && feature.ie_status.value) || feature.ie_views.value] || iePositions[3],
                        browsers: [
                            {
                                name: 'chrome',
                                //This could also be shipped_milestone but sometimes they are behind a flag so need to define
                                status: feature.impl_status_chrome.toLowerCase() === 'enabled by default',
                                link: feature.bug_url
                            },
                            {
                                name: 'firefox',
                                status: feature.ff_views.value === 1,
                                link: feature.ff_views_link
                            },
                            {
                                name: 'ie',
                                status: (feature.ie_status && feature.ie_status.value === 1) || feature.ie_views.value === 1,
                                link: feature.ie_views_link
                            },
                            {
                                name: 'safari',
                                status: feature.safari_views.value === 1,
                                link: feature.safari_views_link
                            },
                            {
                                name: 'opera',
                                status: !!feature.shipped_opera_milestone,
                                //Chrome status doesn't return a link for opera trackin :(
                                link: null
                            }
                        ],
                        spec: {
                            link: feature.spec_link,
                            organization: specFinder(feature.spec_link),
                            status: feature.standardization.text
                        },
                        docs: [
                            {
                                link: 'http://webplatform.org',
                                organization: 'webplatform'
                            }
                        ],
                        demos: [
                            {
                                title: 'Demo',
                                link: 'http://ie.microsoft.com/testdrive/'
                            }
                        ]
                    };

                    if (feature.ie_status && feature.ie_status.link) {
                        transformedFeature.docs.push({
                            link: feature.ie_status.link,
                            organization: 'MSDN'
                        });
                    }

                    return transformedFeature;
                });


                deferred.resolve({
                    features: mergedData,
                    categories: categories,
                    browsers: observedBrowsers,
                    ieVersions: ieVersions
                });
            }, 0);

            return deferred.promise;
        };

        var load = function () {
            return getChromeStatus()
                .then(getIEStatus)
                .then(mergeData);
        };

        return {
            load: load
        };
    }]);
