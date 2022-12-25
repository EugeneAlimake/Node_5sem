let PORT = 3000;
let dgram = require('dgram');
let server = dgram.createSocket('udp4');

server.on('error',(err)=>{
    console.log('Error: ' + err);
    server.close();
});

server.on('message', (msg, info) =>
{
    console.log('Server: от клента получено: ' + msg.toString());
    console.log('Server: получено %d байтов от %s:%d\n', msg.length, info.address, info.port );
    var msgResponse="ECHO: " + msg.toString();
    server.send(msgResponse, 0, msgResponse.length, info.port, info.address,
        (err) => {
        if (err) throw err;
        else{console.log('Data sent');}});
});

server.on('listening', () =>
{
    console.log('Server is listening at port: ' + server.address().port);
    console.log('Server ip :' + server.address().address);
    console.log('Server is IP4/IP6 : ' + server.address().family);
});

server.on('close',()=>{
    console.log('Socket is closed!');
});

server.bind(PORT);