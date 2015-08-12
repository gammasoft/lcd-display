var moment = require('moment'),
    async = require('async'),

    clockIntervalId;

function clearClockInteval() {
    if(clockIntervalId) {
        clearInterval(clockIntervalId);
        clockIntervalId = null;
    }
}

function write(params, lcd, callback) {
    var text = params.text || '',
        currentLine = 0;

    if(!Array.isArray(text)) {
        text = text.match(/.{1,20}/g);
        text = text && text.splice(0, 4) || [];
    }

    clearClockInteval();
    lcd.clear().then(function() {
        async.eachSeries(text, function(line, cb) {
            lcd.setCursor(0, currentLine).then(function() {
                currentLine++;

                line = line.trim();
                line = line.substr(0, 20);

                lcd.print(line).then(function() {
                    cb();
                });
            });
        }, callback);
    });
}

module.exports.write = write;

function clock(params, lcd, callback) {
    var format = params.format || 'DD/MM/YYYY HH:mm:ss',
        locale = params.locale || 'en-US',
        interval = params.interval || 1000;

    clearClockInteval();
    moment.locale(locale);
    lcd.clear().then(function() {
        clockIntervalId = setInterval(function() {
            var text = moment().format(format);

            lcd.setCursor(0, 0).then(function() {
                lcd.print(text);
            });
        }, interval);
    });

    callback();
}

module.exports.clock = clock;