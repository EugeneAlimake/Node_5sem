var http = require('http');
var fs = require('fs');

http.createServer(function (request, response)
{
    if(request.url == "/png"&&request.method == 'GET') {
        const fname = 'C:\\Users\\thesi\\Desktop\\5\\ProgrammingServerCrossplatApplic\\Labs\\2\\2.jpg';
        let jpg = null;

        fs.stat(fname, (err, stat) => {
            if (err) {
                console.log('error:', err);
            } else {
                jpg = fs.readFileSync(fname);
                response.writeHead(200, {'Content-Type': 'image/jpg', 'Content-Type': stat.size});
                response.end(jpg, 'binary');
            }
        });
    }

}).listen(5000);

console.log('Сервер запущен http://localhost:5000/png')