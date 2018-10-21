const express = require('express');
const mongoose = require('mongoose');
const app = express();
const config = require('./config/database');
const path = require('path');

mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err)=>{
    if(err){
        console.log('no se pudo conectar a la base de datos.', err);
    } else {
        console.log('se logro la conexion con la base de datos ' + config.db);
    }
});

app.use(express.static(__dirname + '/client/dist/client'));

app.get('/', (req, res)=> {
    res.sendFile(path.join(__dirname + '/client/dist/client/index.html'));
});

app.listen(8080, ()=>{
    console.log('escuchando por el puerto 8080.');
});