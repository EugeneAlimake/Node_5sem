var http = require("http");
var url = require("url");
var fs = require("fs");

let fact = (n)=>{ return (n <= 1 ? n : n*fact(n-1));}

http.createServer(function (request, response)
{
    if (url.parse(request.url).pathname === '/fact')
    {  console.log(request.url);
        if (typeof url.parse(request.url, true).query.k != 'undefined' )
        {
            let k = parseInt(url.parse(request.url, true).query.k);
            if (Number.isInteger(k))
            {
                process.nextTick(() =>
                {
                    let fact_result = fact(k);
                    response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                    response.end(JSON.stringify({ k:k, fact: fact_result }));
                })
            }
        }
    } else if (url.parse(request.url).pathname==='/')
    {
        let html=fs.readFileSync('C:\\Users\\thesi\\Desktop\\5\\ProgrammingServerCrossplatApplic\\Labs\\3\\3-3.html');
        response.writeHead(200,{'Content-Type': 'text/html; charset=utf-8'});
        response.end(html);
    }

}).listen(5000);

console.log('Start server at http://localhost:5000/')