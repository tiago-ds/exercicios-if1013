var WebSocketServer = require('ws').Server;
wss = new WebSocketServer({ port: 8080, path: '/temperature' });
wss.on('connection', function (ws) {
    ws.on('message', function (message) {
        console.log('Msg received in server: %s ', message);
    });
    console.log('new connection');
    ws.send('Msg from server');
});

wssVoltage = new WebSocketServer({ port: 8081, path: '/voltage' });
wssVoltage.on('connection', function (ws) {
    ws.on('message', function (message) {
        console.log('Msg received in server: %s ', message);
    });
    ws.send(randomInt(0, 100).toString());
});

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}