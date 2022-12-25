const net = require('net');

let HOST = '127.0.0.1';
let PORT = 5000;

let client = new net.Socket();
let intervalRef = null;
let buf = Buffer.alloc(4);//Функция alloc() принимает размер буфера в качестве первого и единственного аргумента.


client.connect(PORT, HOST, () =>
{
    console.log('Client CONNECTED: '+client.remoteAddress + ':' + client.remotePort);
    let k = 0;
    intervalRef = setInterval(()=>
    {
        console.log('Client number: ' + k);
        client.write((buf.writeInt32LE(k++, 0), buf));
    }, 1000);
    setTimeout(()=>
    {
        clearInterval(intervalRef);//отменяет многократные повторения действий, установленные вызовом функции setInterval()
        client.end();
    }, 20000);
});

client.on('data', (data)=>{console.log('Client sum: ' + data.readInt32LE());});

client.on('close', ()=>{console.log('Client close');});