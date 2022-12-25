var http =require('http');
var fs= require('fs');
let bound='----'
let body=`--${bound}\r\n`;
body+='Content-Disposition:form-data; name="file"; Filename="MyFile.png"\r\n';
body+='Content-Type:application/octet-stream\r\n\r\n';

let options=
    {
        host: 'localhost',
        path: `/6-7`,
        port: 5000,
        method:'POST',
        headers: {'Content-Type':`multipart/form-data; boundary=${bound}`}
    }
const req = http.request(options);

req.write(body);//отправляем 1 часть
let stream = new fs.ReadStream("MyFile.png");
stream.on('data',(chunk)=> //вторую часть
{
    req.write(chunk);
    console.log(Buffer.byteLength(chunk));
});
stream.on('end',()=>
{
    req.end(`\r\n--${bound}--\r\n`);//3
});