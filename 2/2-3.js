const http = require("http");

http.createServer(function(request, response)
{
        if(request.url == "/api/name" && request.method == 'GET')
        {
                response.setHeader("Content-Type", "text/plain; charset=utf-8;");
                response.end("Евгения Николаева ");
        }
        else
        {
                response.setHeader("Content-Type", "text/html; charset=utf-8;");
                response.write("<h2>Введите url</h2>");
                response.end();
        }

}).listen(5000);
console.log('Сервер запущен http://localhost:5000/api/name');