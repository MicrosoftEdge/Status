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

        var chromeStatus;
        var ieStatus;

        var getIEStatus = function () {
            return $http.get(ieStatusURL).then(function (response) {
                ieStatus = response.data;
                return ieStatus;
            });
        };

        var getChromeStatus = function () {
            return $http.get(chromeStatusURL).then(function (response) {
                chromeStatus = response.data;

//                _.forEach(chromeStatus, function (item) {
//                    item.id = item.id.toString();
//                });

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
                        return 'w3c';
                    } else if (_.contains(spec, 'ecmascript.org')) {
                        return 'ecma';
                    } else if (_.contains(spec, 'khronos.org')) {
                        return 'khronos';
                    } else if (_.contains(spec, 'whatwg.org')) {
                        return 'whatwg';
                    } else if (_.contains(spec, 'xiph.org')) {
                        return 'xiph';
                    } else if (_.contains(spec, 'ietf.org')) {
                        return 'ietf';
                    } else {
                        return '';
                    }
                };

                var normalizeFeature = function (feature) {
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
                            firefox: {
                                status: feature.ff_views.value === 1,
                                link: feature.ff_views_link
                            },
                            ie: {
                                status: (feature.ie_status && feature.ie_status.value === 1) || feature.ie_views.value === 1,
                                link: feature.ie_views_link,
                                prefixed: feature.ieStatus.iePrefixed,
                                unprefixed: feature.ieStatus.ieUnprefixed
                            },
                            safari: {
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

                var defaultFeature = {
                    "shipped_opera_milestone": "",
                    "shipped_milestone": "",
                    "meta": {
                        "needsflag": false,
                        "milestone_str": "No active development"
                    },
                    "comments": "",
                    "owner": [],
                    "ff_views": {
                        "text": "",
                        "value": 0
                    },
                    "id": 0,
                    "shipped_webview_milestone": null,
                    "category": "",
                    "ie_views": {
                        "text": "",
                        "value": 0
                    }, "prefixed": false,
                    "safari_views": {
                        "text": "",
                        "value": 0
                    },
                    "spec_link": "",
                    "created_by": {
                        "nickname": "",
                        "email": ""
                    },
                    "shipped_ios_milestone": null,
                    "web_dev_views": {
                        "text": "", "value": 0
                    },
                    "impl_status_chrome": "",
                    "ff_views_link": null,
                    "updated": "",
                    "updated_by": {
                        "nickname": "",
                        "email": ""
                    }, "visibility": "",
                    "safari_views_link": null,
                    "footprint": 0,
                    "ie_views_link": null,
                    "shipped_android_milestone": null,
                    "shipped_opera_android_milestone": null,
                    "first_of_milestone": true,
                    "name": "",
                    "standardization": {
                        "text": "", "value": 0
                    },
                    "created": "",
                    "summary": "",
                    "bug_url": null
                };

                var tempCategories = {};
                var statuses = {};

                var mergedData = _.map(ieStatus, function (ieStatusFeature) {
                    var chromeFeature = _.find(chromeStatus, function (chromeStatusFeature) {
                        return chromeStatusFeature.id === ieStatusFeature.id;
                    });

                    var mergedFeature = normalizeFeature(_.defaults(ieStatusFeature, _.defaults(chromeFeature || {}, defaultFeature)));
                    var featureCategory = mergedFeature.category;
                    var featureStatus = mergedFeature.position;

                    if (!tempCategories[featureCategory]) {
                        tempCategories[featureCategory] = {
                            name: featureCategory,
                            selected: false
                        };
                    }

                    if (!statuses[featureStatus]) {
                        statuses[featureStatus] = {
                            name: featureStatus,
                            selected: false
                        };
                    }

                    return mergedFeature;
                });

                deferred.resolve({
                    features: mergedData,
                    categories: _.values(tempCategories),
                    browsers: observedBrowsers,
                    ieVersions: _.values(statuses)
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
