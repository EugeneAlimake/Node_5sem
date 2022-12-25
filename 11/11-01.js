const fs = require('fs');
let webSocket = require('ws');
const crypto = require('crypto');
const randomString = crypto.randomBytes(8).toString('hex');
const webServer = new webSocket.Server({port: 4000, host: 'localhost'});
let k = 0;

webServer.on('connection', (clientSocket) =>
{
    const duplex = webSocket.createWebSocketStream(clientSocket, {encoding: 'utf-8'});
   // const file = fs.createWriteStream(`./upload/file_${++k}.txt`);
    const file = fs.createWriteStream(`./upload/${randomString}.txt`);
    duplex.pipe(file);
});