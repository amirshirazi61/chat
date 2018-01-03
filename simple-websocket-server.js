"use strict";
exports.__esModule = true;
var express = require("express");
var path = require("path");
var ws_1 = require("ws");
var app = express();
app.use('/', express.static(path.join(__dirname, '..', 'client')));
app.use('/node_modules', express.static(path.join(__dirname, '..', 'node_modules')));
app.get('/', function (req, res) {
    console.log(__dirname);
    res.sendFile('D:/myProto/client/simple-websocket-client.html');
});
var httpServer = app.listen(8000, "localhost", function () {
    console.log('HTTP Server is listening on port 8000');
});
// Using WS API
var wsServer = new ws_1.Server({ port: 8085 });
console.log('Websocket server is listening on port 8085.');
wsServer.on('connection', function (ws) {
    ws.send('First Message.');
    ws.on('message', function (message) {
        var subscriptionRequest = message;
        subscribeToProductBids(ws, subscriptionRequest);
        console.log("Server received: %s", message);
    });
});
setInterval(function () {
    broadcastNewBidsToSubscribers();
}, 2000);
// Helper functions
// The map key is a reference to WebSocket connection that represents a user.
var subscriptions = new Map();
function subscribeToProductBids(client, productId) {
    var products = subscriptions.get(client) || [];
    console.log("product: " + products);
    console.log("[...products, productId]: " + products.concat([productId]));
    subscriptions.set(client, products.concat([productId]));
    console.log('map size: ', subscriptions.size);
}
function broadcastNewBidsToSubscribers() {
    subscriptions.forEach(function (products, ws) {
        if (ws.readyState === 1) {
            ws.send('message from broadcastNewBidsToSubscribers()');
        }
        else {
            subscriptions["delete"](ws);
        }
    });
}
