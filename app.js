var express = require('express'),
    port = process.env.PORT || 9000,
    app = express();

app.use(express.bodyParser());
app.use(express.static(__dirname + '/app'));
app.listen(port);