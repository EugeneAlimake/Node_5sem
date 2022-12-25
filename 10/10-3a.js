const WebSocket = require('ws');

let parm2 = process.argv[2];//first parameter, 0-path node, 1-path application
console.log('parm2 = ', parm2);

let prfx = typeof parm2 == 'underfined'?'A':parm2;
const ws = new WebSocket('ws://localhost:5000/broadcast');

ws.on('open', ()=>{
    let k = 0;
    setInterval(()=>{
        ws.send(`client: ${prfx}-${++k}`);
    }, 1000);
    ws.on('message', message =>{
        console.log(`Received message => ${message}`)
    })
    setTimeout(()=>{ws.close()}, 25000);
});