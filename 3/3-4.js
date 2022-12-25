var http = require("http");
var url = require("url");
var fs = require("fs");

let fact = (n) => { return (n <= 1 ? n : n*fact(n-1)); }
function  Fact(n,cd)
{
    this.fn=n;
    this.ffib=fact;
    this.fcd=cd;
    this.calc=()=>{process.nextTick(()=>{this.fcd(null,this.ffib(this.fn));});}
}

http.createServer(function (request, response)
{
    if (url.parse(request.url).pathname === '/fact')
    {
        if (typeof url.parse(request.url, true).query.k != 'undefined' )
        {
            let k = parseInt(url.parse(request.url, true).query.k);
            if (Number.isInteger(k))
            {

                response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                let fac=new Fact(k,(err,result)=> response.end(JSON.stringify({ k:k, fact: result })));
                fac.calc();
            }
        }
    }

    if (url.parse(request.url).pathname === '/')
    {
        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        response.end(fs.readFileSync('C:\\Users\\thesi\\Desktop\\5\\ProgrammingServerCrossplatApplic\\Labs\\3\\3-3.html'));
    }

}).listen(5000);

console.log('tart server at http://localhost:5000/');