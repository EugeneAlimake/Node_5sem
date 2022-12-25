const fs=require('fs');
const WebSocket = require('ws');

const wss= new WebSocket.Server({port:4000, host:'localhost', path:'/download'});
wss.on('connection',(ws)=>{
    const duplex = WebSocket.createWebSocketStream(ws,{encode:'utf8'})
    let rfile = fs.createReadStream(`./download/download.txt`);
    rfile.pipe(duplex);
})