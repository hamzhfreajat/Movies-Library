'use strict';
require('dotenv').config();
const data = require('./data/data.json');
const express = require('express');
const cors = require('cors');
const axios = require("axios");

const server = express();
server.use(cors());

let userSearch = "Spider-Man";
const trendUrl = `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.APIKEY}&language=en-US`;
let chargeUrl = `https://api.themoviedb.org/3/movie/changes?api_key=${process.env.APIKEY}&page=1`;
const certificateUrl = `https://api.themoviedb.org/3/certification/movie/list?api_key=${process.env.APIKEY}`

server.get('/', handelData )
server.get('/favorite',handelFavorite)
server.get('/trending', handleTrendingMovies);
server.get('/search', handleSearchMovies);
server.get('/changes' , handelChanges);
server.get('/certificat' , handleCertifate)
server.get('*',handelNotFound);
server.use(errorHandler);

function Movie(title,poster_path,overview){
    this.title= title;
    this.poster_path = poster_path;
    this.overview=overview;
}



function handelFavorite(req,res){
    res.status(200).send("Welcome to Favorite Page")
}



function handelData(req,res){
    let obj = new Movie(data.title, data.poster_path, data.overview);
    res.status(200).json(obj);
}


function handelNotFound(req,res){
    res.status(404).send('This page does not exist :/ ')
}

function handleTrendingMovies(req , res){

    axios.get(trendUrl).then((result)=>{
            let trendingMovies = result.data.results.map(item => {
                return {
                    "id": item.id,
                    "title":  item.title,
                    "release_date":   item.release_date,
                    "poster_path":   item.poster_path,
                    "overview":   item.overview
                }
            })
            res.status(200).send(trendingMovies)
        }).catch((err)=>{
        errorHandler(err)
    })

}

function handleSearchMovies  (req , res){
    if(req.query.query) {
        userSearch = req.query.query;
    }
    let searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.APIKEY}&language=en-US&query=${userSearch}&page=2`;

    axios.get(searchUrl)
        .then((result)=>{
            res.send(result.data);
        }).catch((err)=>{
        errorHandler(err)
    })

}
function handelChanges(req,res) {
    axios.get(chargeUrl)
        .then((result)=>{
            res.send(result.data);
        }).catch((err)=>{
        errorHandler(err)
    })
}

function handleCertifate(req,res){
    axios.get(certificateUrl)
        .then((result)=>{
            res.send(result.data);
        }).catch((err)=>{
        errorHandler(err)
    })
}
function errorHandler (err, req, res, next) {
    // res.status(500).json(
    //     {
    //         "status": 500,
    //         "massage": err
    //     }
    // )
}
let port = 3000 ; 
server.listen(port,()=>{
    console.log(`you are in port: ${port}`);
})


