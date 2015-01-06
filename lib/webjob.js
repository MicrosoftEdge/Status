'use strict';

var path = require('path');
var request = require('request');
var url = require('url');

var local = function () {
  console.log('Simulating webjob');
  var exec = require('child_process').exec;
  var runjs = path.join('App_data', 'jobs', 'triggered', 'UserVoice', 'run.js');
  var command = 'node ' + runjs;

  var child = exec(command, function (err, sysout, syserr) {
    if (err || syserr) {
      console.error(err);
    } else {
      console.log(sysout);
    }
  });

  child.stdin.end();
};

var production = function () {
  var webjobUrl = url.parse(process.env.WEBJOB_URL);
  webjobUrl.auth = process.env.azureUser + ':' + process.env.azurePass;

  console.log('calling webjob now');
  //TODO: modify url and add Azure user/pass
  //TODO: add github user/pass arguments here!

  request.post(webjobUrl.format(), function (err, response, body) {
    if (err) {
      logger.logError('Error updating repo: ' + err);
    } else {
      logger.logInfo('Repo updating: ' + body);
    }
  });
};

var execute = function () {
  if (process.env.NODE_ENV === 'production') {
    production();
  }else{
    local();
  }
};

module.exports = {
  execute: execute
};
