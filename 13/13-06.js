const net = require('net');

let HOST = '127.0.0.1';
let PORT = 5000;

let client = new net.Socket();
let intervalRef = null;

let buf = Buffer.alloc(4);
let num = parseInt(process.argv[2]);

client.connect(PORT, HOST, () =>
{
    console.log('Client CONNECTED: '+client.remoteAddress + ':' + client.remotePort);

    intervalRef = setInterval(()=>
    {
        console.log('Client  number: ' + num);
        client.write((buf.writeInt32LE(num, 0), buf));
    }, 1000);
    setTimeout(()=>
    {
        clearInterval(intervalRef);
        client.end();
    }, 20000);
});

client.on('data', (data)=>{console.log('Client sum: ' + data.readInt32LE());});

client.on('close', ()=>{console.log('Client closed');});