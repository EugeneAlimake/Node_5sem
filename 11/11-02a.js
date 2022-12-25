const fs = require('fs');
const WebSocket = require('ws');
const crypto = require('crypto');
const randomString = crypto.randomBytes(8).toString('hex');

const ws = new WebSocket('ws://localhost:4000/download');
ws.on('open', ()=>{
    const duplex = WebSocket.createWebSocketStream(ws,{encoding:'utf-8'});
    let wfile = fs.createWriteStream(`./${randomString}.txt`);
    duplex.pipe(wfile);
});