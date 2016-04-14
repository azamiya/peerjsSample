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

app.get('/vsend', function(req, res) {
    res.sendFile(__dirname + "/client/videoChat/videosend.html")
});

app.get('/vreceive', function(req, res) {
    res.sendFile(__dirname + "/client/videoChat/videoreceive.html")
});

app.get('/viewer', function(req, res) {
    res.sendFile(__dirname + "/client/videoWithSensor/viewer.html")
});

app.get('/controller', function(req, res) {
    res.sendFile(__dirname + "/client/videoWithSensor/controller.html")
});

app.listen(3000);
console.log("server starting...");