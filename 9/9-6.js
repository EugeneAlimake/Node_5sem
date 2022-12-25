var http =require('http');
var fs= require('fs');

let bound='----'
let body=`--${bound}\r\n`;
body+='Content-Disposition:form-data; name="file"; Filename="MyFile.txt"\r\n';
body+='Content-Type:text/plain\r\n\r\n';
body+=fs.readFileSync('MyFile.txt');
body+=`\r\n--${bound}--\r\n`;

let options=
    {
        host: 'localhost',
        path: `/6-7`,
        port: 5000,
        method:'POST',
        headers: {'Content-Type':`multipart/form-data; boundary=${bound}`}
    }

const req = http.request(options);

req.end(body);