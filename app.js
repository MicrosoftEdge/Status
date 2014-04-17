var express = require('express'),
    cors = require('cors'),
    path = require('path'),
    fs = require('fs'),
    os = require('os'),
    port = process.env.PORT || 9000,
    app = express(),
    root = 'dist',
    debug = false;

var path = require('path'),
    childProcess = require('child_process'),
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

var localUrl = 'http://' + addresses[0] + ':' + port;

var phantomScript = "var page = require('webpage').create();" +
    "var fs = require('fs');" +
    "page.open('"+ localUrl + "', function () {" +
    "setTimeout(function(){" +
    "fs.write('snapshots/snapshot.html', page.content, 'w');" +
    "phantom.exit()"+
    "}, 5000);" +
    "});";

var phantomScriptFile = new tmp.File();
phantomScriptFile.writeFileSync(phantomScript, 'utf8');

if (process.argv[2] === 'debug') {
    root = 'app';
    debug = true;
}

app.use(express.compress());
app.options('/features', cors());
app.get('/features', function (req, res) {
    res.sendfile(path.join(__dirname, root, 'static', 'ie-status.json'));
});

app.get('/favicon.ico', function (req, res) {
    res.sendfile(path.join(__dirname, root, 'favicon.ico'));
});

app.get('/:id', function (req, res) {
    res.sendfile(path.join(__dirname, root, 'index.html'));
});

//app.use(express.basicAuth('admin','IE11Rocks!'));
app.use(express.bodyParser());

if (debug) {
    app.use(express.static(path.join(__dirname, root)));
} else {
    app.use(express.static(path.join(__dirname, root), { maxAge: 31557600000 }));
}

app.listen(port);

var childArgs = [
    phantomScriptFile.path
];

childProcess.execFile(binPath, childArgs, function (err, stdout, stderr) {
    // handle results
});
