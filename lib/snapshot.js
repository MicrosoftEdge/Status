var path = require('path'),
    os = require('os'),
    phantomProcess = require('child_process'),
    phantomjs = require('phantomjs'),
    tmp = require('temporary'),
    binPath = phantomjs.path;

var interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family == 'IPv4' && !address.internal) {
            addresses.push(address.address)
        }
    }
}

module.exports = function (port, filePath) {
    var localUrl = 'http://' + addresses[0] + ':' + port;

    //Phantom doesn't like \ on the paths, even on windows
    filePath = filePath.replace(/\\/g,'/');

    var phantomScript = "var page = require('webpage').create();" +
        "var fs = require('fs');" +
        "page.open('" + localUrl + "', function () {" +
        "page.evaluate(function(){});" +
        "setTimeout(function(){" +
        "fs.write('" + filePath + "', page.content, 'w');" +
        "phantom.exit()" +
        "}, 5000);" +
        "});";

    var phantomScriptFile = new tmp.File();
    phantomScriptFile.writeFileSync(phantomScript, 'utf8');

    var phantomArgs = [phantomScriptFile.path];

    module.exports.take = function () {
        phantomProcess.execFile(binPath, phantomArgs, function (err, stdout, stderr) {
            // handle results
        });
    };

    return module.exports;
};

