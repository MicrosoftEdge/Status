/**
 * Original file from the MIT Licensed project https://github.com/gruntjs/grunt-lib-phantomjs
 *
 * **/

'use strict';

exports.init = function () {

    // Nodejs libs.
    var path = require('path');

    // External libs.
    var _ = require('lodash');
    var semver = require('semver');
    var Tempfile = require('temporary/lib/file');
    var EventEmitter2 = require('eventemitter2').EventEmitter2;
    var spawn = require('child_process').spawn;

    // Get path to phantomjs binary
    var binPath = require('phantomjs').path;

    // The module to be exported is an event emitter.
    var exports = new EventEmitter2({wildcard: true, maxListeners: 0});

    // Get an asset file, local to the root of the project.
    var asset = path.join.bind(null, __dirname, '..');

    // Call this when everything has finished successfully... or when something
    // horrible happens, and you need to clean up and abort.
    var halted;
    exports.halt = function () {
        halted = true;
    };

    var defaultToWhiteSpace = function(characters) {
        if (characters == null)
            return '\\s';
        else if (characters.source)
            return characters.source;
        else
            return '[' + _s.escapeRegExp(characters) + ']';
    };

    var rtrim = function(str, characters){
        if (str == null) return '';
        if (!characters && String.prototype.trimRight) return String.prototype.trimRight.call(str);
        characters = defaultToWhiteSpace(characters);
        return String(str).replace(new RegExp(characters + '+$'), '');
    };


    var spawnChild = function (opts, done) {
        // Build a result object and pass it (among other things) into the
        // done function.
        var callDone = function (code, stdout, stderr) {
            // Remove trailing whitespace (newline)
            stdout = rtrim(stdout);
            stderr = rtrim(stderr);
            // Create the result object.
            var result = {
                stdout: stdout,
                stderr: stderr,
                code: code,
                toString: function () {
                    if (code === 0) {
                        return stdout;
                    } else if ('fallback' in opts) {
                        return opts.fallback;
                    } else if (opts.grunt) {
                        // grunt.log.error uses standard out, to be fixed in 0.5.
                        return stderr || stdout;
                    }
                    return stderr;
                }
            };
            // On error (and no fallback) pass an error object, otherwise pass null.
            done(code === 0 || 'fallback' in opts ? null : new Error(stderr), result, code);
        };

        var cmd, args;
        var pathSeparatorRe = /[\\\/]/g;
        if (opts.grunt) {
            cmd = process.execPath;
            args = process.execArgv.concat(process.argv[1], opts.args);
        } else {
            // On Windows, child_process.spawn will only file .exe files in the PATH,
            // not other executable types (grunt issue #155).
            try {
                if (!pathSeparatorRe.test(opts.cmd)) {
                    // Only use which if cmd has no path component.
                    cmd = which(opts.cmd);
                } else {
                    cmd = opts.cmd.replace(pathSeparatorRe, path.sep);
                }
            } catch (err) {
                callDone(127, '', String(err));
                return;
            }
            args = opts.args || [];
        }

        var child = spawn(cmd, args, opts.opts);
        var stdout = new Buffer('');
        var stderr = new Buffer('');
        if (child.stdout) {
            child.stdout.on('data', function (buf) {
                stdout = Buffer.concat([stdout, new Buffer(buf)]);
            });
        }
        if (child.stderr) {
            child.stderr.on('data', function (buf) {
                stderr = Buffer.concat([stderr, new Buffer(buf)]);
            });
        }
        child.on('close', function (code) {
            callDone(code, stdout.toString(), stderr.toString());
        });
        return child;
    };


    // Start PhantomJS process.
    exports.spawn = function (pageUrl, options) {
        // Create temporary file to be used for grunt-phantom communication.
        var tempfile = new Tempfile();
        // Timeout ID.
        var id;
        // The number of tempfile lines already read.
        var n = 0;
        // Reset halted flag.
        halted = null;
        // Handle for spawned process.
        var phantomJSHandle;
        // Default options.
        if (typeof options.killTimeout !== 'number') {
            options.timeout = 5000;
        }
        options.options = options.options || {};

        // All done? Clean up!
        var cleanup = function (done, immediate) {
            clearTimeout(id);
            tempfile.unlink();
            var kill = function () {
                // Only kill process if it's connected, otherwise an error would be thrown.
                if (phantomJSHandle.connected) {
                    phantomJSHandle.kill();
                }
                if (typeof done === 'function') {
                    done(null);
                }
            };
            // Allow immediate killing in an error condition.
            if (immediate) {
                return kill();
            }
            // Wait until the timeout expires to kill the process, so it can clean up.
            setTimeout(kill, options.killTimeout);
        };

        // Internal methods.
        var privates = {
            // Abort if PhantomJS version isn't adequate.
            version: function (version) {
                var current = [version.major, version.minor, version.patch].join('.');
                var required = '>= 1.6.0';
                if (!semver.satisfies(current, required)) {
                    exports.halt();
                }
            }
        };

        // Process options.
        var failCode = options.failCode || 0;

        // An array of optional PhantomJS --args.
        var args = [];
        // Additional options for the PhantomJS main.js script.
        var opts = {};

        // Build args array / opts object.
        Object.keys(options.options).forEach(function (key) {
            if (/^\-\-/.test(key)) {
                args.push(key + '=' + options.options[key]);
            } else {
                opts[key] = options.options[key];
            }
        });

        // Keep -- PhantomJS args first, followed by grunt-specific args.
        args.push(
            // The main PhantomJS script file.
                opts.phantomScript || asset('phantomjs/main.js'),
            // The temporary file used for communications.
            tempfile.path,
            // URL or path to the page .html test file to run.
            pageUrl,
            // Additional PhantomJS options.
            JSON.stringify(opts)
        );

        // Actually spawn PhantomJS.
        return phantomJSHandle = spawnChild({
            cmd: binPath,
            args: args
        }, function (err, result, code) {
            if (!err) {
                return;
            }

            // Ignore intentional cleanup.
            if (code === 15 /* SIGTERM */) {
                return;
            }

            // If we're here, something went horribly wrong.
            cleanup(null, true /* immediate */);
            console.log('PhantomJS threw an error:');

            options.done(code);
        });
    };

    return exports;
};