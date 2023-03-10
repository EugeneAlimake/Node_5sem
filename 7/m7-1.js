let fs = require('fs');

class m71
{
    constructor(rootFolder)
    {
        this.rootFolder = rootFolder;
    }

    getFullFileName(relativeFileName)
    {
        return this.rootFolder + relativeFileName;
    }

    writeHTTP404(res)
    {
        res.statusCode = 404;
        res.statusMessage = 'Resourse not found';
        res.end("HTTP ERROR 404: Resourse not found");
    }

    pipeFile(req, res, headers)
    {
        res.writeHead(200, headers);
        fs.createReadStream(this.getFullFileName(req.url)).pipe(res);
    }

    sendFile(req, res, headers)
    {
        console.log(this.getFullFileName(req.url));
        //constants.R_OK используется для проверки существования файла
        fs.access(this.getFullFileName(req.url), fs.constants.R_OK, err =>
        {
            if(err) this.writeHTTP404(res);
            else this.pipeFile(req, res, headers);
        });
    }
}

module.exports=(rootFolder)=>{return new m71(rootFolder);}