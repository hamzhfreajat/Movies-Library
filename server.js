'use strict';

const data = require('./data/data.json');
const express = require('express');
const cors = require('cors');

const server = express();
server.use(cors());

server.get('/', handelData )
server.get('/favorite',handelFavorite)
server.get('*',handelNotFound);
server.use(function (err, req, res, next) {
    res.status(500).json(
        {
            "status": 500,
            "responseText": "Sorry, something went wrong"
        }
    )
})

function Movie(title,poster_path,overview){
    this.title= title;
    this.poster_path = poster_path;
    this.overview=overview;
}


function handelFavorite(req,res){
    ahamd();
    res.status(200).send("Welcome to Favorite Page")
}



function handelData(req,res){
    let obj = new Movie(data.title, data.poster_path, data.overview);
    res.status(200).json(obj);
}


function handelNotFound(req,res){
    res.status(404).send('This page does not exist :/ ')
}

let port = 3000 ; 
server.listen(port,()=>{
    console.log(`you are in port: ${port}`);
})


