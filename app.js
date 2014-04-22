var express = require('express'),
    cors = require('cors'),
    path = require('path'),
    fs = require('fs'),
    os = require('os'),
    snapshot = require('./lib/snapshot.js'),
    port = process.env.PORT || 9000,
    snapshotPath = path.join(__dirname, 'snapshots', 'snapshot__.html'),
    app = express(),
    root = 'dist',
    debug = false;

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

var sendMainPage = function(req, res){
    var ua =req.headers['user-agent'].toLowerCase();

    if(ua.indexOf('googlebot') !== -1 || ua.indexOf('bingbot') !== -1){
        res.sendfile(snapshotPath);
    }else {
        res.sendfile(path.join(__dirname, root, 'index.html'));
    }
};

app.get('/', sendMainPage);
app.get('/:id', sendMainPage);

app.use(express.bodyParser());

if (debug) {
    app.use(express.static(path.join(__dirname, root)));
} else {
    app.use(express.static(path.join(__dirname, root), { maxAge: 31557600000 }));
}

app.listen(port);