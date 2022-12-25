let http = require('http');
let fs = require('fs');

let sql = require('mssql');

const pool = new sql.ConnectionPool({
    server: 'localhost',
    database: 'node_14',
    user: 'sa',
    password: '12345',
    options: {
        trustServerCertificate: true
    }
});

let http_handler = (req, res) =>
{
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    console.log(req.method, " - ", req.url);
    switch (req.method)
    {
        case "GET":     get_handler(req, res);      break;
        case "POST":    post_handler(req, res);     break;
        case "PUT":     put_handler(req, res);      break;
        case "DELETE":  delete_handler(req, res);   break;
        default:        other_handler(req, res);    break;
    }
}

function get_handler(req, res)
{
    let parsedUrl = require('url').parse(req.url);

    switch(true)
    {
        case parsedUrl.pathname.includes("/api/")://проверка на задержание части фрагмента
            let table = parsedUrl.pathname.replace("/api/", "");
            let faculty = table.substring(0, table.indexOf("/"));
            //Заменяет текст в строке, используя регулярное выражение или строку поиска.
            let table1 = decodeURI(parsedUrl.pathname.replace(`/api/${faculty}/`, ""));
            let facultyname =decodeURI(table1.substring(0, table1.indexOf("/")));
            console.log(facultyname);
            if(facultyname==''){
            pool.connect().then(() =>
            {
               // pool.request()
                pool.request().query(`select * from ${table}`, (err, result) =>
                {
                    if (err)
                    {
                        res.end(JSON.stringify({ code: 1, message: `Table ${table} does not exist` }));
                    }
                    else
                    {
                        console.log(result.recordset);
                        res.end(JSON.stringify(result.recordset));
                    }
                    pool.close();
                });
            });}
            else
            {
             if(faculty=='faculty')
             {
                 pool.connect().then(() =>
                 {
                     // pool.request()
                     pool.request().query(`select PULPIT.FACULTY,PULPIT.PULPIT,PULPIT.PULPIT_NAME from FACULTY inner join PULPIT on FACULTY.FACULTY=PULPIT.FACULTY where FACULTY.FACULTY='${facultyname}'`, (err, result) =>
                     {

                             console.log(result.recordset);
                             res.end(JSON.stringify(result.recordset));

                         pool.close();
                     });
                 });
             }
                if(faculty=='auditoriumtypes')
                {
                    pool.connect().then(() =>
                    {
                        // pool.request()
                        pool.request().query(`select AUDITORIUM.AUDITORIUM,AUDITORIUM.AUDITORIUM_CAPACITY,AUDITORIUM.AUDITORIUM_NAME,AUDITORIUM.AUDITORIUM_TYPE from AUDITORIUM_TYPE inner join AUDITORIUM on AUDITORIUM_TYPE.AUDITORIUM_TYPE=.AUDITORIUM.AUDITORIUM_TYPE where AUDITORIUM_TYPE.AUDITORIUM_TYPE='${facultyname}'`, (err, result) =>
                        {


                                console.log(result.recordset);
                                res.end(JSON.stringify(result.recordset));
                            pool.close();
                        });
                    });
                }
            }
            break;
        case parsedUrl.pathname === '/':
            let html = fs.readFileSync('14.html');
            res.writeHead(200, { 'Content-Type' : 'text/html;charset=utf-8' });
            res.end(html);
            break;
    }

    console.log(parsedUrl);
}

function post_handler(req, res)
{
    let parsedUrl = require('url').parse(req.url);

    let insertedObject = '';

    if (parsedUrl.pathname.includes("/api/"))
    {
        let table = parsedUrl.pathname.replace("/api/", "");
        console.log("table: " + table);

        req.on('data', (data) => { insertedObject += data; });

        req.on('end', () =>
        {
            let obj = JSON.parse(insertedObject);
            console.log(obj);

            pool.connect().then(() =>
            {
                let keys = Object.keys(obj);
                let array = Object.values(obj);

                let k = "";
                let v = "";

                for (let i = 0; i < keys.length; i++)
                {
                    if (i != 0)
                    {
                        k += ` , ${keys[i]} `;
                        v += ` , '${array[i]}' `;
                    }
                    else
                    {
                        k += ` ${keys[i]} `;
                        v += ` '${array[i]}' `;
                    }
                }
                console.log(k + "    " + v);
                pool.request().query(`insert into ${table}  (${k}) values (${v})`, (err, result) =>
                {
                    if (err)
                    {
                        res.end(JSON.stringify( {
                            code: 1,
                            message: `Table ${table} does not exist`
                        }));
                    }
                    else
                    {
                        console.log("Inserted");
                    }
                    pool.close();
                });
            });
        })
    }

    res.end("POST REQUEST");
}

function put_handler(req, res)
{
    let parsedUrl = require('url').parse(req.url);
    let insertedObject = '';

    if (parsedUrl.pathname.includes("/api/"))
    {
        let table = parsedUrl.pathname.replace("/api/", "");
        console.log("table: " + table);

        req.on('data', (data) => { insertedObject += data; });
        req.on('end', () =>
        {
            let obj = JSON.parse(insertedObject);
            console.log(obj);

            pool.connect().then(() =>
            {
                let keys = Object.keys(obj);
                let array = Object.values(obj);
                console.log(array[0]) // John

                let updatedValues = "";
                for (let i = 0; i < keys.length; i++)
                {
                    console.log('updatedValues: ' + updatedValues);
                    if (i != 0)
                    {
                        updatedValues += `, ${keys[i]} = '${array[i]}' `;
                    }
                    else
                    {
                        updatedValues += `${keys[i]} = '${array[i]}' `;
                    }
                }
                console.log(updatedValues);

                pool.request().query(`update ${table} set ${updatedValues} where ${keys[0]} = '${array[0]}'`, (err) =>
                {
                    console.log(`update ${table} set ${updatedValues} where ${keys[0]} = '${array[0]}'`);
                    if (err)
                    {
                        res.end(JSON.stringify({
                            code: 1,
                            message: `Table ${table} does not exist`
                        }));
                    }
                    else
                    {
                        console.log("Updated");
                    }
                    pool.close();
                });
            });
        })
    }

    res.end("PUT REQUEST");
}

function delete_handler(req, res)
{
    let parsedUrl = require('url').parse(req.url);

    if (parsedUrl.pathname.includes("/api/"))
    {
        let str = parsedUrl.pathname.replace("/api/", "");

        table = str.substring(0, str.indexOf("/"));

        id = decodeURI(str.replace(table + "/", ""));
        //Новая строка, представляющая некодированную версию заданного кодированного
        //унифицированного идентификатора ресурса (URI).
         let del=false;
        console.log("table: " + table + " id: " + id);
        pool.connect().then(() => {
            console.log(`delete from ${table} where ${table} = '${id}'`);
            pool.request().query(`delete from ${table} where ${table} = '${id}'`, (err, result) => {
                console.log(result);
                if (err) {
                    if(err.message.includes('constraint')) {
                        res.end(JSON.stringify({
                            code: 2,
                            message: `not delete`
                        }));
                    }else{
                    res.end(JSON.stringify({
                        code: 1,
                        message: `Table ${table} does not exist`
                    }))};
                } else {
                    console.log("Deleted");
                    del=true;
                    res.end();
                }
                pool.close();
            });
        });




    }
}

function other_handler(req, res)
{
    res.end(`{"${req.method}": "${req.url}"}`);
}

let httpServer = http.createServer(http_handler);
httpServer.listen(3000, () => console.log(`Server has started on http://localhost:3000`));

