let http = require('http');
let fs = require('fs');
let parseString = require("xml2js").parseString;
let qs = require('querystring');
let url = require('url');
let xmlbuilder = require("xmlbuilder");
var mp = require("multiparty");

let server = http.createServer((req, res) => {
    console.log(url.parse(req.url).pathname);
    console.log(req.method);

    if(RegExp(/^\/parameter\/[0-9]{1,100}\/[0-9]{1,100}/).test(url.parse(req.url).pathname))
    {
        console.log("hi")
        var p = url.parse(req.url, true);
        let x = +p.pathname.split('/')[2];
        let y = +p.pathname.split('/')[3];
        if(Number.isInteger(x) && Number.isInteger(y)) {
            res.write(`${x}\n`);
            res.write(`${y}\n`);
            res.write(`x-y=${x-y}\n`);
            res.write(`x+y=${x+y}\n`);
            res.write(`x*y=${x*y}\n`);
            res.write(`x/y=${x/y}\n`);

        }res.end();}
    if (url.parse(req.url, true).pathname.split("/")[1] == "files") {
        let result = url.parse(req.url, true).pathname.split("/");
        if(result[2]!=null){
            console.log("result");
            console.log(result);
        fs.access(`./static/${result[2]}`, fs.constants.R_OK, err => {
            if(err) {
                res.writeHead(404, {"Content-Type" : "text/plain; charset=utf-8"});
                res.end(`файл ${result[2]} не найден`);
            }
            else {
                res.writeHead(200, {"Content-Type" : "application/txt; charset=utf-8"});
                fs.createReadStream(`./static/${result[2]}`).pipe(res);
            }
        });}
    }
    switch (req.method) {
        case 'GET':
            switch (url.parse(req.url).pathname) {

                case '/':
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                    res.write(fs.readFileSync('./8-0.html'));
                    res.end();
                    break;
                case '/connection':
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                    res.write(`KeepAliveTimeout: ${server.keepAliveTimeout}`);
                    let set = Number(url.parse(req.url, true).query.set);
                    if (Number.isInteger(set)) {
                        server.keepAliveTimeout = set;
                        res.write(`\nУстановлено новое значение параметра  KeepAliveTimeout = ${server.keepAliveTimeout}`);

                    }
                    server.close();
                    res.end();
                    break;
                case '/headers':
                    console.log("headers");
                    res.setHeader('Headerornev','hi');
                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'});
                    res.write(`req headers: ${JSON.stringify(req.headers)}`);
                    res.write(`req headers: ${JSON.stringify(req.headers)}`);
                    res.write(`<h1>res headers: ${JSON.stringify(res.getHeaders())}<h1>`);
                    res.end();
                    break;
                case '/parameter':
                    let x,y;
                     x = Number(url.parse(req.url, true).query.x);
                     y = Number(url.parse(req.url, true).query.y);
                    if (Number.isInteger(x) && Number.isInteger(y)) {
                        res.write(`${x}\n`);
                        res.write(`${y}\n`);
                        res.write(`x-y=${x-y}\n`);
                        res.write(`x+y=${x+y}\n`);
                        res.write(`x*y=${x*y}\n`);
                        res.write(`x/y=${x/y}\n`);
                    }
                    else
                    {
                        res.write(`ERROR`);
                    }
                    res.end();
                    break;
                case '/close':
                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'});
                    let timer=null;
                    server.close();
                    res.write(`сервер закроется через 10 s`);
                    timer = setTimeout(() => {
                        res.write('Закрытие сервера');

                        process.exit(0);
                    }, 10000);
                    res.end();
                    break;
                case'/socket':
                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                    res.write(`ServerAddress =  ${req.socket.localAddress}\n`);
                    res.write(`ServerPort = ${req.socket.localPort}\n`);
                    res.write(`ClientAddress = ${req.socket.remoteAddress}\n`);
                    res.write(`ClientPort = ${req.socket.remotePort}\n`);
                    res.end();
                    break;
                case '/req-data':
                    console.log("req-data");
                    let buf = '';
                   req.on('data', (data) => {
                        console.log(`data = , ${data}`);
                        console.log('requsent.on(data) = ', data.length);
                        buf += data;
                    });
                    req.on('end', () => {
                        console.log('request.on(end) = ', buf.length)
                    });
                    res.end('req-data');
                    break;
                case'/resp-status':{
                    let code, mess;
                    if((code = url.parse(req.url, true).query.code) && (mess = url.parse(req.url, true).query.mess))  {
                        res.writeHead(code,mess, {'Content-Type': 'text/html; charset=utf-8'});
                        res.statusCode = code;
                        res.statusMessage = mess;
                        res.end(`Code: ${code}, Note: ${mess}`);
                    }}
                    break;
                case'/files':
                    fs.readdir("./static", (err, files) =>
                    {
                        res.setHeader("X-static-files-count", files.length);
                        res.writeHead(200, {"Content-Type" : "text/plain; charset=utf-8"});
                        res.write(`res headers: ${JSON.stringify(res.getHeaders())}`);
                        res.end(`${files.length}`);
                    });
                    break;
                case'/upload':
                    res.writeHead(200, {"Content-Type" : "text/html; charset=utf-8"});
                    res.end(fs.readFileSync("upload.html"));
                    break;
                case '/formparameter':
                    res.write(fs.readFileSync('./formparameter.html'));
                    res.end();
                    break;
            }
                break;
        case 'POST':
            switch (url.parse(req.url).pathname) {
                case '/formparameter':
                    console.log('hi');
                    let obj = "";
                    req.on("data", data => {obj += data;});
                    req.on("end", () =>
                    {
                        let result = qs.parse(obj);
                        res.writeHead(200, {"Content-Type" : "text/plain; charset=utf-8"});
                        res.write(`text: ${result.text}\n`);
                        res.write(`number: ${result.number}\n`);
                        res.write(`date: ${result.date}\n`);
                        res.write(`checkbox: ${result.checkbox}\n`);
                        res.write(`radio: ${result.radio}\n`);
                        res.write(`textarea: ${result.textarea}\n`);
                        res.write(`send: ${result.send}\n`);
                        res.end();
                    });
                    break;
                case '/json':
                    let jsonData = "";
                    req.on("data", data => {jsonData += data;});
                    req.on("end", () =>
                    {
                        let result = JSON.parse(jsonData);
                        let comment = "Ответ";
                        let sum = result.x + result.y;
                        let concat = `${result.s}: ${result.o.surname}, ${result.o.name}`;
                        let length = result.m.length;
                        res.writeHead(200, {"Content-Type": "text/json; charset=utf-8"});
                        res.end(JSON.stringify(
                            {
                                "comment": comment,
                                "x_plus_y": sum,
                                "Concatination_s_o": concat,
                                "Length_m": length
                            }
                        ));
                    });
                    break;
                case '/xml':
                    let xmltxt = "";
                    req.on("data", data => {xmltxt += data;});
                    req.on("end", () =>
                    {
                        parseString(xmltxt, (err, result) =>
                        {
                            if(err) res.end("bad xml");
                            else
                            {
                                res.writeHead(200, {"Content-Type" : "text/xml; charset=utf-8"});
                                res.end(studentscalc(result));
                            }
                        });
                    });
                    break;
                case '/upload':
                    let form = new mp.Form({uploadDir: "./static"});
                    form.on("field", (name, value) => {

                    });
                    form.on("file", (name, file) => {
                    });
                    form.on("error", (err) => {
                        res.writeHead(200, {"Content-Type" : "text/plain; charset=utf-8"});
                        res.end(`${err}`);
                    });
                    form.on("close", () => {
                        res.writeHead(200, {"Content-Type" : "text/plain; charset=utf-8"});
                        res.end("Файл получен");
                    });
                    form.parse(req);
                    break;
            }
            break;
        default:
            console.log("ERROR");
            break;
    }
});
server.listen(5000, ()=>{console.log('Server running at http://localhost:5000/')});

var studentscalc = (obj) =>
{
    let rc = "<result>parse error</result>";
    try
    {
        let sum = 0;
        let concat = "";
        let xmldoc = xmlbuilder.create("response").att("request", obj.request.$.id);

        obj.request.x.map((e, i) =>
        {
            sum += parseInt(e.$.value);
        });

        obj.request.m.map((e, i) =>
        {
            concat += String(e.$.value);
        });
        xmldoc.ele("sum", {element: "x", result: sum});
        xmldoc.ele("concat", {element: "m", result: concat});

        rc = xmldoc.toString({pretty: true});
    }
    catch(e){console.log(e);}
    return rc;
}