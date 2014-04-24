var express = require('express'),
    cors = require('cors'),
    path = require('path'),
    bots = require(path.join(__dirname, 'lib', 'bots.js')),
    botsLength = bots.length,
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
    for(var i = 0; i < botsLength; i++){
        if(ua.indexOf(bots[i]) !== -1){
            res.sendfile(snapshotPath);
            return;
        }
    }

    res.sendfile(path.join(__dirname, root, 'index.html'));
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