var express = require('express'),
    path = require('path'),
    port = process.env.PORT || 9000,
    app = express();

app.use(express.basicAuth('admin','IE11Rocks!'));
app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, 'app')));
app.listen(port);