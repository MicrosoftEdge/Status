// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the Apache License, Version 2.0 (the "License"); you may not use these files except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
angular.module('statusieApp')
    .service('Status', ['$http', '$q', function Status($http, $q) {
        'use strict';
        //We can load it locally using /static/features.json
        var chromeStatusURL = 'https://www.chromestatus.com/features.json';
        var ieStatusURL = '/features';
        var userVoiceDataURL = '/uservoice';

        var observedBrowsers = _.map(['Internet Explorer', 'Chrome', 'Firefox', 'Safari', 'Opera'], function (browser) {
            return {name: browser, selected: false};
        });

        var statuses = _.map(['Shipped', 'Prefixed', 'In Development', 'Under Consideration', 'Not currently planned'], function (status) {
            return {name: status, selected: false};
        });

        var normalizedStatuses = {
            notplanned: 'Not currently planned',
            deprecated: 'Deprecated',
            underconsideration: 'Under Consideration',
            indevelopment: 'In Development',
            notsupported: 'Not Supported',
            shipped: 'Shipped',
            implemented: 'Shipped',
            prefixed: 'Prefixed',
            iedev: 'Preview Release'
        };

        var chromeStatus;
        var ieStatus;
        var userVoiceData;

        var specFinder = function (spec) {
            if (!spec) {
                return 'clip';
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
                return 'clip';
            }
        };

        var normalizeBrowserStatus = function(featureStatus,isOpera,needsFlag,chromeStatus){
            var status;

            // The following checks are for opera, chromestatus only returns null or the version number
            if (isOpera) {
                if (featureStatus > 0 && !needsFlag) {
                    return 'Shipped';
                } else if ( (_.isNumber(featureStatus) && needsFlag) ||
                            (chromeStatus === 'Enabled by default') ||
                            (chromeStatus === 'In development') ||
                            (chromeStatus === 'Behind a flag') ) {
                    return 'In Development';
                }else{
                    return 'Not Supported';
                }
            }
            
            switch(featureStatus){
                case 'Enabled by default': status = 'Shipped'; break;
                case 'In development': status = 'In Development'; break;
                case 'Shipped': status = featureStatus; break;
                case 'In Development': status = featureStatus; break;
                case 'Behind a flag': status = 'In Development'; break;
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
                uservoice: userVoiceData[ feature.uservoiceid ] || false,
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
                        status: normalizeBrowserStatus(feature.shipped_opera_milestone, true, feature.meta.needsflag, feature.impl_status_chrome),
                        //Chromium status doesn't return a link for opera tracking :(
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
            "bug_url": null,
            "uservoice": false
        };

        var getIEStatus = function () {
            return $http.get(ieStatusURL).then(function (response) {
                ieStatus = response.data;
                return ieStatus;
            });
        };

        var getChromeStatus = function () {
            return $http.get(chromeStatusURL).then(function (response) {
                chromeStatus = response.data;
                return chromeStatus;
            });
        };

        var getUserVoiceData = function () {
            return $http.get( userVoiceDataURL ).then(function ( response ) {
                userVoiceData = response.data;
                return userVoiceData;
            });
        };

        var mergeData = function () {
            var deferred = $q.defer();

            setTimeout(function () {

                var tempCategories = {};

                var mergedData = _.map(ieStatus, function (ieStatusFeature) {
                    var chromeFeature = _.find(chromeStatus, function (chromeStatusFeature) {
                        return chromeStatusFeature.id === ieStatusFeature.id;
                    });

                    var mergedFeature = normalizeFeature(_.defaults(ieStatusFeature, _.defaults(chromeFeature || {}, defaultFeature)));
                    var featureCategory = mergedFeature.category;

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
                    ieVersions: statuses,
                    uservoice: userVoiceData
                });
            }, 0);

            return deferred.promise;
        };

        var load = function () {
            return $q.all([
                getIEStatus(), 
                getChromeStatus(), 
                getUserVoiceData()
            ]).then(mergeData);
        };

        return {
            load: load,
            statuses: normalizedStatuses
        };
    }]);
