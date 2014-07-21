var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser')
var mongo = require('mongodb').MongoClient;

var app = express();

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'assets')));

http.createServer(app).listen(1337, function () {
    console.log('Express server listening on port ' + 1337);
});

var CONNECTION_STRING = '';


var API_MESSAGES_URL = '/api/messages';

var callMongo = function (action) {
    mongo.connect(CONNECTION_STRING, action);
};

app.get(API_MESSAGES_URL, function (req, res) {

    var result = {
        total: 0,
        items: []
    };

    callMongo(function (err, db) {
        if (err) {
            res.send(500, err);
            return;
        }
        

        var collection = db.collection('messages');

        collection.find().toArray(function (err, results) {
            result.items = results;
            result.total = results.length;
            db.close();
            res.send(result);
        });
    });

});

app.post(API_MESSAGES_URL, function (req, res) {

    var messages = req.body.messages;

    if (!messages || !messages.length) {
        res.send(204);
        return;
    }

    callMongo(function (err, db) {
        if (err) {
            res.send(500);
            return;
        }

        var collection = db.collection('messages');

        var saved = 0;
        for (var i = 0; i < messages.length; i++) {
            collection.insert(messages[i], function (err, docs) {
                if (!err) {
                    if (++saved === messages.length) {
                        db.close();
                        res.send(201);
                    }
                }
            });
        }
    })
});

app.delete(API_MESSAGES_URL, function (req, res) {
    callMongo(function (err, db) {
        if (err) {
            res.send(500);
            return;
        }

        db.collection('messages').remove(null, null, function(){
            db.close();
            res.send(201);
        });
    });
});