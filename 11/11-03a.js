const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:4000/');
const duplex = WebSocket.createWebSocketStream(ws, {encoding: 'utf-8'});
duplex.pipe(process.stdout);
/*process.stdin.pipe(duplex);

ws.on('pong',(data)=>{
    console.log('on pong', data.toString());
});
setInterval(()=>{console.log('server: ping'); ws.ping('client: ping')}, 5000);
*/