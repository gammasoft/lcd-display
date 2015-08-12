var express = require('express'),
    bodyParser = require('body-parser'),
    Lcd = require("i2c-lcd"),

    app = express(),
    actions = require('./actions'),
    HTTP_PORT = process.env.HTTP_PORT || 8000,
    lcd = new Lcd('/dev/i2c-1', 0x27);

app.use(bodyParser.json({
    limit: '256kb'
}));

app.post('/', function(req, res, next) {
    var action = actions[req.body.action],
        params = req.body.params || {};

    action(params, lcd, function(err) {
        if(err) {
            return next(err);
        }

        res.json({});
    });
});

lcd.init().then(function() {
    app.listen(HTTP_PORT, function() {
        console.log('lcd-display listening on port', HTTP_PORT);
    });
});