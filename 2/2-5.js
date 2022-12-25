const http = require("http");
const fs = require("fs");

http.createServer(function(request, response)
{
    if(request.url == "/fetch" && request.method == 'GET')
    {
        response.setHeader("Content-Type", "text/html; charset=utf-8;");
        let html = fs.readFileSync('C:\\Users\\thesi\\Desktop\\5\\ProgrammingServerCrossplatApplic\\Labs\\2\\fetch.html');
        response.end(html);
    }

    if(request.url == "/api/name" && request.method == 'GET')
    {
        response.setHeader("Content-Type", "text/plain; charset=utf-8;");
        response.end("Евгения Николаева");
    }
}).listen(5000);
console.log('Сервер запущен http://localhost:5000/fetch');