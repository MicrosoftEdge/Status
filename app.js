var express = require('express'),
    cors = require('cors'),
    path = require('path'),
    fs = require('fs'),
    port = process.env.PORT || 9000,
    app = express();

var content = fs.readFileSync(path.join('dist', 'static', 'ie-status.json'), {encoding: 'utf8'});

app.use(express.compress());
app.options('/features', cors());
app.get('/features', function(req, res){
   res.sendfile(path.join(__dirname, 'dist', 'static', 'ie-status.json'));
});

app.get('/:id', function(req, res){
   res.sendfile(path.join(__dirname, 'dist', 'index.html'));
});

//app.use(express.basicAuth('admin','IE11Rocks!'));
app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, 'dist')));

app.listen(port);

