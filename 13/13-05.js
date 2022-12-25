const net = require('net');

let HOST = '127.0.0.1';
let PORT = 5000;

let server = net.createServer((sock)=>
{
    let sum = 0;
    let clientSocketString = `${sock.remoteAddress}:${sock.remotePort}`;
    console.log('Server CONNECTED: '+clientSocketString);

    sock.on('data', (data)=>
    {
        console.log(`Number from ${clientSocketString}: ` + data.readInt32LE());
        sum+=data.readInt32LE();
    });0

    let buf = Buffer.alloc(4); //Функция alloc() принимает размер буфера в качестве первого и единственного аргумента.
    let intervalRef = setInterval(() =>
    {
        buf.writeInt32LE(sum, 0);//offset  это целочисленное значение, представляющее количество байтов,
        // которые необходимо пропустить перед началом записи, а значение смещения находится в диапазоне от 0 до буфера.длина – 4;
        sock.write(buf);
    }, 5000);

    sock.on('close', () =>
    {
        console.log('Server CLOSED: '+ sock.remoteAddress+' '+sock.remotePort);
        clearInterval(intervalRef);
    });
});

server.on('listening', ()=>{console.log('TCP-server listening on: '+HOST+':'+PORT);});
server.listen(PORT, HOST);