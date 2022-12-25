const http = require('http');
const url = require('url');
const fs = require('fs');
const data = require('./DB');

const db = new data.DataBase();

db.on('GET', async(req, res)=>{
    console.log('DB.GET');
    if (ss_enabled==true)
        server.emit('requestCounting');
    res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
    res.write(await  db.select());
    res.end();
});
db.on('POST', async(req, res)=>{
    console.log('DB.POST');
    if (ss_enabled==true)
        server.emit('requestCounting');
    let person=new data.Human();
            req.on('data', data => {
                person=JSON.parse(data);
                db.insert(person);
            });

    res.end(`id: ${person.id}, name: ${person.name}, birth: ${person.birth}`);
});
db.on('PUT', async (request, response) =>
{
    console.log('DB.PUT');
    if (ss_enabled==true)
        server.emit('requestCounting');
    let newHuman = new data.Human();

    request.on('data', data =>
    {
        newHuman = JSON.parse(data);
        db.update(newHuman);
    });

    response.end(`id: ${newHuman.id}, name: ${newHuman.name}, birth: ${newHuman.birth}`);
});

db.on('DELETE', async (request, response) =>
{
    console.log('DB.DELETE');
    if (ss_enabled==true)
        server.emit('requestCounting');
    let removedHuman = new data.Human();

    request.on('data', data =>
    {
        removedHuman = JSON.parse(data);
        db.delete(removedHuman.id);
    });

    response.end(`id: ${removedHuman.id}, name: ${removedHuman.name}, birth: ${removedHuman.birth}`);
});
db.on('COMMIT', async (request, response) =>
{
    console.log('DB.COMMIT');
    db.commit();

});

let timer_for_sd=null;
let timer_for_sc=null;
let timer_for_ss=null;
let ss_enabled = false;
let statistic = new data.Statistic();

process.stdin.setEncoding('utf-8');
process.stdin.unref();
process.stdin.on('readable',()=>
{
    let chunk=null;
    //chunk=process.stdin.read();
    //console.log(chunk);
    while ((chunk = process.stdin.read()) != null)
    {
        let x=0;
        let trimmed_chunk=chunk.trim();
        let substrings=trimmed_chunk.split(' ');
        console.log(substrings[0]);
        switch (substrings[0])
        {
            case 'sd':
                x = parseInt(substrings[1]);
                //console.log(x);
                if (x > 0)
                {

                    if (timer_for_sd != null) {
                        console.log('очищение таймера');
                        clearTimeout(timer_for_sd);
                    }
                    console.log(`сервер закроется через ${x} s`);
                    timer_for_sd = setTimeout(() => {
                        console.log('Закрытие сервера');
                        server.close();
                    }, x * 1000);

                }
                else {
                    if (timer_for_sd != null) {
                        console.log('таймер был очищен');
                        clearTimeout(timer_for_sd);
                    }
                }
                break;

            case 'sc':
            {
                     x = parseInt(substrings[1]);
                    if (x > 0) {
                        if (timer_for_sc != null) {
                            console.log('очищение таймера');
                            clearTimeout(timer_for_sc);
                        }
                        console.log(`commit каждые ${x}s`);
                        timer_for_sc = setInterval(() => {
                            if (ss_enabled == true) {
                                server.emit('commitCounting');
                            }
                            console.log('Commit');
                            db.commit();
                        }, x * 1000).unref();

                    } else {
                        if (timer_for_sc != null) {
                            console.log('очищение таймера');
                            clearInterval(timer_for_sc);
                            timer_for_sc = null;
                        }

                    }
                    break;
            }
            case 'ss':

                    x = parseInt(substrings[1]);
                    if (x > 0) {
                        if (timer_for_ss == null && !ss_enabled) {
                            ss_enabled = true;

                            statistic.reset();
                            statistic.startDate = Date();

                            console.log(`Запись статистики ${x} s`);

                            timer_for_ss = setTimeout(() => {
                                console.log('Запись статистики отключена');
                                clearTimeout(timer_for_ss);
                                ss_enabled = false;
                                statistic.finishDate = Date();
                                timer_for_ss = null;
                            }, x * 1000).unref();
                        }
                    } else {
                        if (timer_for_ss != null) {
                            console.log('Запись статистики отключена');
                            clearTimeout(timer_for_ss);
                            ss_enabled = false;
                            statistic.finishDate = Date();
                            timer_for_ss = null;
                        }
                    }
                    break;
            default:console.log('Unknown command');

        }
    }
});

let server=http.createServer(function (request, response)
{
    if (url.parse(request.url).pathname == '/api/db')
    {
        switch (request.method)
        {
            case 'GET':
            case 'POST':
            case 'PUT':
            case 'DELETE':
                console.log("nen");
                db.emit(request.method, request, response);
                break;
            default:
                break;
        }
    }

    if(request.url == '/')
    {
        response.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
        response.end(fs.readFileSync('./4.html'));
    }
    if(url.parse(request.url).pathname == '/api/ss')
    {
        response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
        response.end(JSON.stringify(statistic));
    }

}).listen(5000, () =>
{
    console.log('Start server at http://localhost:5000/');
});

server.on('requestCounting', () => statistic.requestsCount += 1);
server.on('commitCounting', () => statistic.commitsCount += 1);

module.exports.server = server;