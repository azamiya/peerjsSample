var express = require('express'),
    app = express();

//not need from express4.0
//app.use(app.router);
app.use(express.static('client'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/client/datachat.html")
});

app.get('/send', function(req, res) {
    res.sendFile(__dirname + "/client/datasend.html")
});

app.get('/get', function(req, res) {
    res.sendFile(__dirname + "/client/dataget.html")
});

app.listen(3000);
console.log("server starting...");