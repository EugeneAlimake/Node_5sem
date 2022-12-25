const net = require('net');

let HOST = '127.0.0.1';
let PORT = 5000;

let client = new net.Socket();
let intervalRef = null;

client.connect(PORT, HOST, () =>
{
    console.log('Client CONNECTED: '+client.remoteAddress + ':' + client.remotePort);

    intervalRef = setInterval(()=>{client.write('Hello from client')}, 1000);
    setTimeout(()=>
    {
        clearInterval(intervalRef);
        client.end();
    }, 10000);
});
client.on('data', (data)=>{console.log('Client DATA: ', data.toString());});
client.on('close', ()=>{console.log('Client CLOSED');});
client.on('error', (e)=>{console.log('Client ERROR');});