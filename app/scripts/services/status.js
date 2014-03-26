angular.module('statusieApp')
    .service('Status', ['$http', '$q', function Status($http, $q) {
        'use strict';
        //We can load it locally using /static/features.json
        var chromeStatusURL = 'http://www.chromestatus.com/features.json';

        //TODO: load this from a remote url
        var ieStatusURL = '/static/ie-status.json';
        var observedBrowsers = _.map(['Internet Explorer', 'Chrome', 'Firefox', 'Safari', 'Opera'], function (browser) {
            return {name: browser, selected: false};
        });
        var status = _.map(['Investigating', 'Implementing', 'Opposed', 'IE6', 'IE7', 'IE8', 'IE9', 'IE10', 'IE11'], function (version) {
            return {name: version, selected: false};
        });
        var chromeStatus;
        var ieStatus;
        var categories;

        var getIEStatus = function () {
            return $http.get(ieStatusURL).then(function (response) {
                ieStatus = response.data;
                return ieStatus;
            });
        };

        var getChromeStatus = function () {
            return $http.get(chromeStatusURL).then(function (response) {
                chromeStatus = response.data;

                _.forEach(chromeStatus, function (item) {
                    item.id = item.id.toString();
                });

//                var tempCategories = {};
//
//                chromeStatus = {};
//
//                _.forEach(data, function (item) {
////                    item.category = item.category.replace(/[^a-zA-Z0-9]/g, ''); //Remove Whitespace
//                    chromeStatus[item.name] = item;
//                    tempCategories[item.category] = {
//                        name: item.category,
//                        selected: false
//                    };
//                });
//
//                categories = _.toArray(tempCategories);

                return chromeStatus;
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
                    1: 'IE' + (Math.ceil(Math.random() * 6) + 5), //This should be the real IE version
                    2: "In Development",
                    3: "Investigating",
                    5: "Opposed"
                };

                var transformFeature = function (feature) {
                    var finalFeature = {
                        name: feature.name,
                        summary: feature.summary,
                        category: feature.category,
                        normalized_category: feature.category.replace(/[^a-zA-Z0-9]/g, '').toLowerCase(),
                        position: feature.ieStatus.text,
                        browsers: {
                            chrome: {
                                status: (feature.impl_status_chrome && feature.impl_status_chrome.toLowerCase() === 'enabled by default') || false,
                                link: feature.bug_url
                            },
                            firefox:{
                                status: feature.ff_views.value === 1,
                                link: feature.ff_views_link
                            },
                            ie: {
                                status: (feature.ie_status && feature.ie_status.value === 1) || feature.ie_views.value === 1,
                                link: feature.ie_views_link,
                                prefixed: feature.ieStatus.iePrefixed,
                                unprefixed: feature.ieStatus.ieUnprefixed
                            },
                            safari:{
                                status: feature.safari_views.value === 1,
                                link: feature.safari_views_link
                            },
                            opera: {
                                status: !!feature.shipped_opera_milestone,
                                //Chrome status doesn't return a link for opera tracking :(
                                link: null
                            }
                        },
                        spec: {
                            link: feature.link || feature.spec_link,
                            organization: specFinder(feature.link || feature.spec_link),
                            status: feature.standardStatus
                        },
                        docs: {
                            msdn: feature.msdn,
                            wpd: feature.wpd
                        }
                    };

                    return finalFeature;
                };

                var tempCategories = {};

                var mergedData = _.map(ieStatus, function (ieStatusFeature) {
                    var chromeFeature = _.find(chromeStatus, function (chromeStatusFeature) {
                        return chromeStatusFeature.id === ieStatusFeature.id;
                    });

                    var mergedFeature = _.defaults(ieStatusFeature, chromeFeature);
                    var featureCategory = mergedFeature.category;

                    if(!tempCategories[featureCategory]){
                        tempCategories[featureCategory] = {
                            name: featureCategory,
                            selected: false
                        };
                    }

                    return transformFeature(mergedFeature);
                });

                categories = _.toArray(tempCategories);

                deferred.resolve({
                    features: mergedData,
                    categories: categories,
                    browsers: observedBrowsers,
                    ieVersions: status
                });
            }, 0);

            return deferred.promise;
        };

        var load = function () {
            return getIEStatus()
                .then(getChromeStatus)
                .then(mergeData);
        };

        return {
            load: load
        };
    }]);
