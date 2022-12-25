const http = require('http');
const fs = require('fs');
const url = require('url');
const rpcWS = require('rpc-websockets').Server;

const file_path = './StudentList.json';

let get_handler = (request, response) =>
{
    let path = url.parse(request.url).pathname;
    switch(true)
    {
        case path === '/':

            fs.readFile(file_path, (err, data) =>
            {
                response.setHeader('Content-Type', 'application/json');
                response.end(data);
            });
            break;

        case /\/\d+/.test(path):
            fs.readFile(file_path, (err, data) =>
            {
                let json = JSON.parse(data.toString());
                for (let i = 0; i < json.length; i++)
                {
                    if(json[i].id === Number(path.match(/\d+/)[0]))
                    {
                        response.setHeader('Content-Type', 'application/json');
                        response.write(JSON.stringify(json[i]));
                    }
                }
                if(!response.hasHeader('Content-Type'))
                {
                    response.setHeader('Content-Type', 'text/plain');
                    response.write('No data');
                }
                response.end();
            });
            break;
        case path == '/backup':
            fs.readdir('./backup', (err, files) =>
            {
                response.setHeader('Content-Type', 'application/json');
                let json = [];
                for (let i = 0; i < files.length; i++)
                {
                    json.push( { id: i, name: files[i]});
                }
                response.end(JSON.stringify(json));
                console.log(files.length);
            });
            break;
    }
};

let delete_handler = (request, response) =>
{
    let path = url.parse(request.url).pathname;
    switch (true)
    {
        case /\/backup\/\d+/.test(path):
            let flag = false;
            fs.readdir('./backup', (err, files) =>
            {
                for (let i = 0; i < files.length; i++)
                {
                    if (files[i].match(/\d{8}/)[0] < Number(path.match(/\d+/)))
                    {
                        flag = true;
                        fs.unlink(`./backup/${files[i]}`, (e) =>
                        {
                            if (e)
                            {
                                console.log('Error');
                                response.end('Error');
                            }
                            else
                            {
                                console.log('Ok');
                                response.end('Ok');
                            }
                        });
                    }
                }
                if (!flag)
                {
                    response.setHeader('Content-Type', 'text/plain');
                    response.end('No files');
                }
            });
            break;
        case /\/\d+/.test(path):
            fs.readFile(file_path, (err, data) =>
            {
                let StudentFound = false;
                let json = JSON.parse(data.toString());
                let DeletedStudentId = Number(path.match(/\d+/)[0]);
                for (let i = 0; i < json.length; i++)
                {
                    if (json[i].id === DeletedStudentId)
                    {
                        response.setHeader('Content-Type', 'application/json');
                        response.write(JSON.stringify(json[i]));
                        json.splice(i, 1);
                        StudentFound = true;
                        break;
                    }
                }
                if(StudentFound)
                {
                    fs.writeFile(file_path, JSON.stringify(json), (e) =>
                    {
                        if (e)
                        {
                            console.log('Error');
                            response.write('Error');
                        }
                        else
                        {
                            console.log('Ok');
                            response.write('Ok');
                        }
                        response.end();
                    });
                }
                else
                {
                    response.end(`Student ${DeletedStudentId} not found`);
                }
            });
            break;
    }
};

let post_handler = (request, response) =>
{
    let path = url.parse(request.url).pathname;
    switch(path)
    {
        case '/':
            let body = '';
            request.on('data', (data) => { body += data; });
            request.on('end', () =>
            {
                let newStudent = JSON.parse(body);
                fs.readFile(file_path, (err, data) =>
                {
                    let isStudentAlreadyInList = false;
                    let studentsList = JSON.parse(data.toString());
                    for (let i = 0; i < studentsList.length; i++)
                    {
                        if (studentsList[i].id == newStudent.id)
                        {
                            isStudentAlreadyInList = true;
                            break;
                        }
                    }

                    if(!isStudentAlreadyInList)
                    {
                        studentsList.push(newStudent);
                        fs.writeFile(file_path, JSON.stringify(studentsList), (e) =>
                        {
                            if (e)
                            {
                                console.log('Error');
                                response.end('Error');
                            }
                            else
                            {
                                console.log('Student is added');
                                response.end(JSON.stringify(newStudent));
                            }
                        });
                    }
                    else
                    {
                        response.setHeader('Content-Type', 'text/plain');
                        response.end(`Student with id = ${newStudent.id} exists`);
                    }
                });
            });
            rpc_server.emit('ListChangeEvent');
            break;

        case '/backup':
            let date = new Date();
            let MyDateString = date.getFullYear() + ('0' + (date.getMonth()+1)).slice(-2)
                +('0' + date.getDate()).slice(-2)+('0' + date.getHours()).slice(-2)+('0' + date.getSeconds()).slice(-2);
            console.log(date);
            console.log(date.getDate());
            setTimeout( () =>
            {
                fs.copyFile(file_path, `./backup/${MyDateString}_StudentList.json`, (err) =>
                {
                    if (err)
                    {
                        console.log('Error');
                        response.end('Error');
                    }
                    else
                    {
                        console.log('File is copied');
                        response.end('Ok');
                    }
                });
            }, 2000);
            break;
    }
};

let put_handler = (request, response) =>
{
    let path = url.parse(request.url).pathname;
    switch(path)
    {
        case '/':
            let body = '';
            request.on('data', function (data) { body += data; });
            request.on('end', function ()
            {
                fs.readFile(file_path, (err, data) =>
                {
                    let flag = false;
                    let json = JSON.parse(data.toString());
                    for (let i = 0; i < json.length; i++)
                    {
                        if (json[i].id === JSON.parse(body).id)
                        {
                            json[i] = JSON.parse(body);
                            fs.writeFile(file_path, JSON.stringify(json), (e) =>
                            {
                                if (e)
                                {
                                    console.log('Error');
                                    response.end('Error');
                                }
                                else
                                {
                                    console.log('Student is altered');
                                    response.end(JSON.stringify(JSON.parse(body)));
                                }
                            });
                            flag = true;
                        }
                    }
                    if(!flag)
                    {
                        response.setHeader('Content-Type', 'text/plain');
                        response.end(`Student with id = ${JSON.parse(body).id} does not exist`);
                    }
                });
            });
            rpc_server.emit('ListChangeEvent');
            break;
    }
};

let server = http.createServer((request, response) =>
{
    switch(request.method)
    {
        case 'GET': get_handler(request, response); break;
        case 'POST': post_handler(request, response); break;
        case 'PUT': put_handler(request, response); break;
        case 'DELETE': delete_handler(request, response); break;
    }
}).listen(4000);

console.log(`Listening on http://localhost:4000`);

//---------------------------------------------------------------
let rpc_server = new rpcWS({port:5000, host:'localhost'});
rpc_server.event('ListChangeEvent');
