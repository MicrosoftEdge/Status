var express = require('express'),
    cors = require('cors'),
    path = require('path'),
    fs = require('fs'),
    port = process.env.PORT || 9000,
    app = express();

var content = fs.readFileSync(path.join('app', 'static', 'ie-status.json'), {encoding: 'utf8'});

app.use(express.compress());
app.options('/features', cors());
app.get('/features', cors(), function(req, res, next){
    res.writeHeader(200, {"Content-Type": "application/json"});
    res.write(content);
    res.end();
});
//app.use(express.basicAuth('admin','IE11Rocks!'));
app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, 'app')));

app.listen(port);

