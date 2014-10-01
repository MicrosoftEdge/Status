// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the Apache License, Version 2.0 (the "License"); you may not use these files except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
var express = require('express'),
    bodyParser = require('body-parser'),
    compress = require('compression'),
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

app.use(compress());

app.route('/features')
    .options(cors())
    .get(cors(), function (req, res) {
        res.sendfile(path.join(__dirname, root, 'static', 'ie-status.json'));
    });

app.route('/uservoice')
    .options(cors())
    .get(cors(), function (req, res) {
        res.sendfile(path.join(__dirname, root, 'static', 'uvoicedata.json'));
    });


app.get('/favicon.ico', function (req, res) {
    res.sendfile(path.join(__dirname, root, 'favicon.ico'));
});

var sendMainPage = function (req, res) {
    var ua = req.headers['user-agent'].toLowerCase();
    for (var i = 0; i < botsLength; i++) {
        if (ua.indexOf(bots[i]) !== -1) {
            res.sendfile(snapshotPath);
            return;
        }
    }

    res.sendfile(path.join(__dirname, root, 'index.html'));
};

app.get('/', sendMainPage);
app.get('/:id', sendMainPage);

app.use(bodyParser());

if (debug) {
    app.use(express.static(path.join(__dirname, root)));
} else {
    app.use(express.static(path.join(__dirname, root), { maxAge: 31557600000 }));
}

app.listen(port);