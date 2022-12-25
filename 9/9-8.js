var http =require('http');
const fs=require('fs');
let options=
    {
        host: 'localhost',
        path: '/8',
        port: 5000,
        method:'GET'
    }
const req = http.request(options,(res)=>
{
    res.pipe(fs.createWriteStream('MyFile.png'));
});

req.end();