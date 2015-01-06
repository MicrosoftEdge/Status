"use strict";

var http = require("http"),
  file = require("fs"),
  path = require('path'),
  name = "uvoicedata.json";

var destination = '';

if (process.env.WEBROOT_PATH) {
  destination = path.join(process.env.WEBROOT_PATH, 'dist', 'static', name);
} else {
  destination = path.join(process.cwd(), 'app', 'static', name);
}

var key = process.env.userVoiceKey,
  url = process.env.userVoiceUrl + key;

if (!key) {
  return;
}

var suggestions = [],
  responseObj = {};

getPage(url, key, 1);

function getPage(location, key, page) {

  var url = location + "&page=" + page + "&per_page=100";

  console.log("Getting page: " + page);

  http.get(url, function (response) {

    var cache = "";

    response.on("data", function (data) {
      cache = cache + String(data);
    });

    response.on("end", function () {

      cache = JSON.parse(cache);
      suggestions = suggestions.concat(cache.suggestions);
      responseObj = cache.response_data;

      if (suggestions.length < responseObj.total_records) {

        getPage(location, key, ++page);

      } else {

        console.log("Collected %d suggestions", suggestions.length);

        var reshaped = reshape(suggestions);

        file.writeFile(destination, JSON.stringify(reshaped), function () {
          console.log("File saved in " + destination);
        });
      }
    });
  });
}

function reshape(array) {

  console.log("Reshaping results");

  return array.reduce(function (obj, value) {

    obj[value.id] = {
      "url": value.url.replace('http:', 'https:'),
      "title": value.title,
      "votes": value.vote_count
    };

    return obj;

  }, {});
}
