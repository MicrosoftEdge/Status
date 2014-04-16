/**
 * Parts of this file are (highly) inspired by the MIT Licensed project https://github.com/cburgdorf/grunt-html-snapshot
 *
 * **/
'use strict';

var fs = require("fs"),
    path = require("path"),
    os = require('os'),
    phantom = require("./phantom.js").init();

var asset = path.join.bind(null, __dirname, '..');

var options = {
    msWaitForPages: 4000,
    fileNamePrefix: 'snapshot_',
    sanitize: function (requestUri) {
        return requestUri.replace(/#|\/|\!/g, '_');
    },
    snapshotPath: '',
    sitePath: '',
    removeScripts: true,
    removeLinkTags: false,
    removeMetaTags: false,
    replaceStrings: []
};

// the channel prefix for this async grunt task
var taskChannelPrefix = "" + new Date().getTime();

var sanitizeFilename = options.sanitize;

var isLastUrl = function (url) {
    return options.urls[options.urls.length - 1] === url;
};

phantom.on(taskChannelPrefix + ".error.onError", function (msg, trace) {
    phantom.halt();
});

phantom.on(taskChannelPrefix + ".htmlSnapshot.pageReady", function (msg, url) {
    var plainUrl = url.replace(sitePath, '');

    var fileName = options.snapshotPath +
        options.fileNamePrefix +
        sanitizeFilename(plainUrl) +
        '.html';

    if (options.removeScripts) {
        msg = msg.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    }

    if (options.removeLinkTags) {
        msg = msg.replace(/<link\s.*?(\/)?>/gi, '');
    }

    if (options.removeMetaTags) {
        msg = msg.replace(/<meta\s.*?(\/)?>/gi, '');
    }

    options.replaceStrings.forEach(function (obj) {
        var key = Object.keys(obj);
        var value = obj[key];
        var regex = new RegExp(key, 'g');
        msg = msg.replace(regex, value);
    });

    //Do something here to write the file

    phantom.halt();

    isLastUrl(plainUrl) && done();
});

var sitePath = options.sitePath;


var take = function (url) {
    console.log('running ' + url);
    phantom.spawn(sitePath + url, {
        // Additional PhantomJS options.
        options: {
            phantomScript: asset('lib/bridge.js'),
            msWaitForPages: options.msWaitForPages,
            bodyAttr: options.bodyAttr,
            cookies: options.cookies,
            taskChannelPrefix: taskChannelPrefix
        },
        // Complete the task when done.
        done: function (err) {
            console.log('something');
        }
    });
};

module.exports = {take: take};