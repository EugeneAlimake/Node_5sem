const net = require('net');

let HOST = '127.0.0.1';
let PORT1 = 40000;
let PORT2 = 50000;

let h = (port) => { return (sock) =>
{
    let clientSocket = `${sock.remoteAddress}:${sock.remotePort}`;
    console.log('CONNECTED: '+clientSocket);

    sock.on('data', (data)=>
    {
        console.log(`DATA ${port} from ${clientSocket}: ` + data.readInt32LE());
        sock.write(`ECHO: ${data.readInt32LE()}`);
    });

    sock.on('close', () =>
    {
        console.log(`CLOSED ${port}: `+ sock.remoteAddress+' '+sock.remotePort);
    });
};}

net.createServer(h(PORT1)).listen(PORT1, HOST).on('listening', ()=>{console.log('TCP-server listening on: '+HOST+':'+PORT1);});
net.createServer(h(PORT2)).listen(PORT2, HOST).on('listening', ()=>{console.log('TCP-server listening on: '+HOST+':'+PORT2);});