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
  console.log('calling webjob now');
  //TODO: modify url and add Azure user/pass
  //TODO: add github user/pass arguments here!

  request.post({
    uri: process.env.WEBJOB_URL,
    headers : {
      Authorization: process.env.WEBJOB_AUTH,
      'content-type': 'text/plain'
    }
  }, function (err) {
    if (err) {
      console.error('Error updating uservoice: ' + err);
    } else {
      console.log('UserVoice data updated');
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
