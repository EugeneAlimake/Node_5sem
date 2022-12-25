const net = require('net');

let HOST = '127.0.0.1';
let PORT = parseInt(process.argv[2]);

let client = new net.Socket();
let intervalRef = null;

//let num = parseInt(process.argv[3]);
let buf = Buffer.alloc(4);

client.connect(PORT, HOST, () =>
{
    let k=0;
    console.log('Client CONNECTED: '+client.remoteAddress + ':' + client.remotePort);

    intervalRef = setInterval(()=>
    {
        k++;
        console.log('Client: ' + k);
        client.write((buf.writeInt32LE(k, 0), buf));
    }, 1000);
    setTimeout(()=>
    {
        clearInterval(intervalRef);
        client.end();
    }, 20000);
});

client.on('data', (data)=>{console.log('data: ' + data.toString());});

client.on('close', ()=>{console.log('Client closed');});