var http =require('http');
var query= require('querystring');

let params=JSON.stringify({x:3,y:4, s:"xxx"});
let options=
    {
        host: 'localhost',
        path: `/3`,
        port: 5000,
        method:'POST'
    }

const req = http.request(options, (res) =>
{
    console.log('http.request: statusCode: ',res.statusCode);
    let data = '';
    res.on('data',(chunk) => { console.log('http.request: data: body:\n', data+=chunk.toString('utf-8')); });
    res.on('end',()=>{ console.log('http.request: end: body:\n', data); });
});

req.write(params);
req.end();