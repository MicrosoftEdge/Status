var express = require('express'),
    cors = require('cors'),
    path = require('path'),
    port = process.env.PORT || 9000,
    app = express();

app.use(express.compress());
//We shouldn't need to add the options as we only allow the GET verb
app.use(cors());
app.use(express.basicAuth('admin','IE11Rocks!'));
app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, 'app')));

app.listen(port);