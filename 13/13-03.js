const net = require('net');

let HOST = '127.0.0.1';
let PORT = 5000;


let server = net.createServer((sock)=>
{
    let sum = 0;//сама сумма
    console.log('Server CONNECTED: '+sock.remoteAddress + ':' + sock.remotePort);

    sock.on('data', (data)=>
    {
        console.log('Number: ' + data.readInt32LE());
        sum+=data.readInt32LE();//прибавление
    });

    let buf = Buffer.alloc(4);//Функция alloc() принимает размер буфера в качестве первого и единственного аргумента.
    let intervalRef = setInterval(() =>
    {
        buf.writeInt32LE(sum, 0);
        sock.write(buf);//передает сумму клиенту
    }, 5000);

    sock.on('close', () =>
    {
        console.log('Server CLOSED: '+ sock.remoteAddress+' '+sock.remotePort);
        clearInterval(intervalRef);
    });
});

server.on('listening', ()=>{console.log('TCP-server listening on: '+HOST+':'+PORT);});
server.listen(PORT, HOST);