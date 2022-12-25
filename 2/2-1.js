var http = require('http');
var fs = require('fs');

http.createServer(function (request, response)
{
 if(request.url == "/html"&&request.method == 'GET') {
  let html = fs.readFileSync('C:\\Users\\thesi\\Desktop\\5\\ProgrammingServerCrossplatApplic\\Labs\\2\\index.html');
  response.writeHead(200, {'Content-Type': 'text/html'});
  response.end(html);
 }

}).listen(5000);

console.log('Сервер запущен http://localhost:5000/html')