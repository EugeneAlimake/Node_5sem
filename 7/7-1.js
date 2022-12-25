let http = require('http');
let fs = require('fs');
let path = require('path');
let stat = require('./m7-1')('./static');

let server = http.createServer((req, res) =>
{
    if(req.url == '/')
    {
        res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
        res.end(fs.readFileSync(
            './index.html'));
    }
    else
    {
        if(req.method=='GET')
        {
            console.log(path.extname(req.url));
            switch(path.extname(req.url))
            {
                case '.html':
                    stat.sendFile(req,res, {'Content-Type':'text/html; charset=utf-8'});
                    break;
                case '.css':
                    stat.sendFile(req,res, {'Content-Type':'text/css; charset=utf-8'});
                    break;
                case '.js':
                    stat.sendFile(req,res, {'Content-Type':'text/javascript; charset=utf-8'});
                    break;
                case '.png':
                    stat.sendFile(req,res, {'Content-Type':'image/png;'});
                    break;
                case '.docx':
                    stat.sendFile(req,res, {'Content-Type':'application/msword; charset=utf-8'});
                    break;
                case '.json':
                    stat.sendFile(req,res, {'Content-Type':'application/json; charset=utf-8'});
                    break;
                case '.xml':
                    stat.sendFile(req,res, {'Content-Type':'application/xml; charset=utf-8'});
                    break;
                case '.mp4':
                    stat.sendFile(req,res, {'Content-Type':'video/mp4; charset=utf-8'});
                    break;

                default:
                    stat.writeHTTP404(res);
                    break;
            }
        }
        else
        {
            res.statusCode = 405;
            res.statusMessage = 'Invalid method';
            res.end("<h1 align='center' >HTTP ERROR 405: This server is processing only GET requests<h1>");
        }
    }
});
server.listen(5000, ()=>{console.log('Server running at http://localhost:5000/')});