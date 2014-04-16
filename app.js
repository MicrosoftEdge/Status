var express = require('express'),
    cors = require('cors'),
    path = require('path'),
    fs = require('fs'),
    os = require('os'),
    snapshot = require('./lib/snapshot.js'),
    port = process.env.PORT || 9000,
    app = express(),
    root = 'dist',
    debug = false;

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

var localUrl = 'http://' + addresses[0];
if (!process.env.PORT) {
    localUrl += ':9000';
}


if(process.argv[2] === 'debug'){
    root = 'app';
    debug = true;
}

app.use(express.compress());
app.options('/features', cors());
app.get('/features', function(req, res){
   res.sendfile(path.join(__dirname, root, 'static', 'ie-status.json'));
});

app.get('/favicon.ico', function(req, res){
    res.sendfile(path.join(__dirname, root, 'favicon.ico'));
});

app.get('/:id', function(req, res){
   res.sendfile(path.join(__dirname, root, 'index.html'));
});

//app.use(express.basicAuth('admin','IE11Rocks!'));
app.use(express.bodyParser());

if(debug){
    app.use(express.static(path.join(__dirname, root)));
}else{
    app.use(express.static(path.join(__dirname, root), { maxAge: 31557600000 }));
}

app.listen(port);

snapshot.take(localUrl);