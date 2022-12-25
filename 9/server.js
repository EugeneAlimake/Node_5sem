let http = require('http');
let url = require('url');
let fs = require('fs');
let parseString= require('xml2js').parseString;
let xmlbuilder= require('xmlbuilder');
let mp=require('multiparty');

let server = http.createServer((req, res)=>
{
    let parsedUrl = url.parse(req.url, true);
    switch (req.method)
    {
        case 'GET':

            switch (url.parse(req.url).pathname)
            {
                case '/1':
                    res.writeHead(200,{'Content-Type': 'text/html;charset=utf-8'});
                    res.end("first task");
                    break;
                case '/2':
                    res.writeHead(200,{'Content-Type': 'text/html;charset=utf-8'});
                    res.end("2. Params: "+parsedUrl.query.x+", "+parsedUrl.query.y);
                    break;
                case '/8':
                    let path ='MyFile.png';
                    fs.access(path, fs.constants.R_OK, err=>{
                        if(err){
                            res.statusCode=404;
                            res.end('Resourse not found!');
                        }else{
                            fs.createReadStream(path).pipe(res);
                        }
                    })
                   // res.end(fs.readFileSync('MyFile.png'));
                    break;
                default:
                    res.statusCode = 404;
                    console.log('Unhandled pathname');
                    break;
            }

            break;

        case 'POST':
            switch (url.parse(req.url).pathname)
            {
                case '/3':
                    let data = '';
                    req.on('data', (chunk) => {
                        data += chunk;
                    });
                    req.on('end', () => {
                        data = JSON.parse(data);
                        res.writeHead(200, {'Content-type': 'application/json; charset=utf-8'});
                        res.end(" Params: "+data.x+", "+data.y+", "+data.s);
                    });
                    break;

                case '/4':
                    let result='';
                    let body='';
                    req.on('data',chunk=>{body += chunk;});
                    req.on('end',()=>
                    {
                        let parsedJSON = JSON.parse(body);
                        result=
                            {
                                comment:"LR_9",
                                x_plus_y:parsedJSON.x + parsedJSON.y,
                                Concatination_s_o:parsedJSON.s + parsedJSON.o.surname + ", " + parsedJSON.o.name,
                                Length_m:parsedJSON.m.length
                            };
                        res.writeHead(200,{'Content-Type': 'application/json'});
                        console.log(result);
                        res.end(JSON.stringify(result));
                    });
                    break;

                case '/5':
                    let result_x=0;
                    let result_m='';
                    let id='';
                    let body_5='';
                    req.on('data',chunk=>{body_5+=chunk.toString();});
                    req.on('end',()=>
                    {
                        console.log(body_5);
                        parseString(body_5,function(err,result)
                        {
                            id=result.request.$.id;
                            result.request.m.map((e,i)=>
                            {
                                result_m+=e.$.value;
                            });
                            result.request.x.map((e,i)=>
                            {
                                result_x+=(+e.$.value);
                            });
                        });
                        let result=xmlbuilder.create('response').att('id',id);
                        result.ele('sum',{element:"x",result:result_x});
                        result.ele('concat',{element:"m",result:result_m});
                        res.writeHead(200,{'Content-Type': 'application/xml'});
                        res.end(result.toString());
                    });
                    break;
                case '/6-7':
                    let result_6='';
                    let form =new mp.Form({uploadDir:'./static'});
                    form.on('field',(name,value)=>
                    {
                        console.log('------------field-------------');
                        console.log(name,value);
                        result_6+=`<br/>---${name}= ${value}`;
                    });
                    form.on('file', (name, file)=>
                    {
                        console.log('-----file ------------');
                        console.log(name,file);
                        result_6+=`<br/>---${name}= ${file.originalFilename}: ${file.path}`;
                    });
                    form.parse(req);
                    res.end();
                    break;

                default:
                    res.statusCode = 404;
                    console.log('Unhandled pathname');
                    break;
            }
            break;
        default:
            console.log('Unhandled method of request');
            res.write('Unhandled method of request');
            break;
    }
});

server.listen(5000, ()=>{console.log('Server running at http://localhost:5000/')});