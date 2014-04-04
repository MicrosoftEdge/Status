angular.module('statusieApp')
    .service('Status', ['$http', '$q', function Status($http, $q) {
        'use strict';
        //We can load it locally using /static/features.json
        var chromeStatusURL = 'http://www.chromestatus.com/features.json';

        //TODO: load this from a remote url
        var ieStatusURL = '/features';
        var observedBrowsers = _.map(['Internet Explorer', 'Chrome', 'Firefox', 'Safari', 'Opera'], function (browser) {
            return {name: browser, selected: false};
        });

        var statuses = _.map(['Shipped', 'Prefixed', 'In Development', 'Under Consideration', 'Not currently planned'], function (browser) {
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

                var normalizeBrowserStatus = function(featureStatus){
                    var status;

                    // The following checks are for opera, chromestatus only returns null or the version number
                    if(_.isNull(featureStatus)){
                        return 'Not Supported';
                    }
                    if(_.isNumber(featureStatus) && featureStatus > 2){
                        return 'Shipped';
                    }

                    switch(featureStatus){
                        case 'Enabled by default': status = 'Shipped'; break;
                        case 'In development': status = 'In Development'; break;
                        case 'Shipped': status = featureStatus; break;
                        case 'In Development': status = featureStatus; break;
                        case 1: status = 'Shipped'; break;
                        case 2: status = 'In Development'; break;
                        default: status = 'Not Supported';
                    }

                    return status;
                };

                var statusDescriptions = {
                    'Shipped': 'The feature is on by default in a stable release of the browser. Unless noted otherwise, all or near all of the feature is supported.',
                    'Prefixed': 'The feature is on by default in a stable release of the browser and may not be complete. All or some of the relevant API names have a vendor prefix (or other experimental prefix, like X- or experimental-). API signatures and behavior may not necessarily match the latest iteration of the standard.',
                    'In Development': 'This feature is currently in development or coming soon.',
                    'Under Consideration': 'The feature is under consideration for implementation in a future release.',
                    'Not currently planned': 'This feature is not under active consideration for implementation in a future release.'
                };


                var normalizeFeature = function (feature) {
                    var finalFeature = {
                        name: feature.name,
                        normalized_name: feature.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase(),
                        summary: feature.summary,
                        category: feature.category,
                        normalized_category: feature.category.replace(/[^a-zA-Z0-9]/g, '').toLowerCase(),
                        position: feature.ieStatus.text,
                        statusDescription: statusDescriptions[feature.ieStatus.text],
                        browsers: {
                            chrome: {
                                status: normalizeBrowserStatus(feature.impl_status_chrome),
                                link: feature.bug_url
                            },
                            firefox: {
                                status: normalizeBrowserStatus(feature.ff_views.text),
                                link: feature.ff_views_link
                            },
                            ie: {
                                status: feature.ieStatus.text,
                                link: feature.ie_views_link,
                                prefixed: parseInt(feature.ieStatus.iePrefixed),
                                unprefixed: parseInt(feature.ieStatus.ieUnprefixed)
                            },
                            safari: {
                                status: normalizeBrowserStatus(feature.safari_views.text),
                                link: feature.safari_views_link
                            },
                            opera: {
                                status: normalizeBrowserStatus(feature.shipped_opera_milestone),
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

                    return mergedFeature;
                });

                deferred.resolve({
                    features: mergedData,
                    categories: _.values(tempCategories),
                    browsers: observedBrowsers,
                    ieVersions: statuses
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
