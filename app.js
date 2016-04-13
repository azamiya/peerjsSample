var express = require('express'),
    app = express();

//not need from express4.0
//app.use(app.router);
app.use(express.static('client'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/client/datachat.html")
    //res.send('hello world');
});
app.get('/about', function(req, res) {
    res.send('about this page!');
});

app.listen(3000);
console.log("server starting...");