const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(express.static('public'));
app.use(express.static('file'));
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());

app.get('/', function(req, res){
    fs.readFile('public/index.html', function(err, data){
        if (err) throw err;
        res.send(data);
    });
})

app.get('/readFile', function(req, res){
    fs.readFile('file/index.txt', function(err, data){
        res.json(JSON.parse(data));
    });
})

app.post('/writeFile', function(req, res){
    const data = req.body;
    fs.writeFile('file/index.txt', JSON.stringify(data), function(err){
        if (err) throw err;
        res.end('Saved');
    });
})

const server = app.listen(process.env.port || '8000', function(){
    const host = server.address().address;
    const port = server.address().port;
    console.log(`server listening on : ${host}${port}`)
})