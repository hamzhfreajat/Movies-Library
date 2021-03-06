'use strict';
require('dotenv').config();
const data = require('./data/data.json');
const express = require('express');
const cors = require('cors');
const axios = require("axios");
const pg = require('pg');
// const client = new pg.Client(process.env.DATABASE_URL);
const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
})

const server = express();
server.use(cors());
server.use(express.json());

const PORT = process.env.PORT;
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
server.post('/addMovie',addMovies);
server.put('/Update/:id',updateMovie);
server.delete('/DELETE/:id',deleteMovie);
server.get('/getOneMovies/:id',getOneMovies);
server.get('/getMovies',getMovies);

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

function addMovies(req,res){
  const movie = req.body;
  console.log(req.body);
  let sql = `INSERT INTO movies_data(title,movies_path,overview,comment) VALUES ($1,$2,$3,$4) RETURNING *;`
  let values=[movie.title,movie.movies_path,movie.overview,movie.comment];
  client.query(sql,values).then(data =>{
      res.status(200).json(data.rows);
  }).catch(error=>{
      errorHandler(error,req,res)
  });
}
function getMovies(req,res){
    let sql = `SELECT * FROM movies_data;`;
    console.log("hi"); 
    client.query(sql).then(data=>{
        console.log(data); 
       res.status(200).json(data.rows);
    }).catch(error=>{
        errorHandler(error,req,res)
    });
}

function updateMovie(req,res){
    const movie = req.body; 
    const id = req.params.id; 
    console.log('out'); 
    const sql = `UPDATE movies_data SET title =$1, movies_path = $2, overview = $3 ,comment=$4  WHERE id=$5 RETURNING *;`; 
    let values=[movie.title,movie.movies_path,movie.overview,movie.comment,id];
    client.query(sql,values).then(data=>{
        console.log('in')
        res.status(200).json(data.rows);
    }).catch(error=>{
        errorHandler(error,req,res)
    });
}
function deleteMovie(req,res){
    const id = req.params.id;  
    const sql = `DELETE FROM movies_data WHERE id=$1;`; 
    let value= [id];
    client.query(sql,value).then(data=>{
        res.status(200).json(data.rows);
    }).catch(error=>{
        errorHandler(error,req,res)
    });
}
function getOneMovies(req , res){
    console.log('out'); 
    const id = req.params.id;
    const sql = `SELECT * FROM movies_data WHERE id=$1;`
    const value = [id]; 
    client.query(sql,value).then(data => {
        console.log(data); 
        res.status(200).json(data.rows); 
    })
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
            res.json(result.data);
        }).catch((err)=>{
        errorHandler(err)
    })
}

function handleCertifate(req,res){
    axios.get(certificateUrl)
        .then((result)=>{
            res.json(result.data);
        }).catch((err)=>{
        errorHandler(err)
    })
}
function errorHandler (err, req, res) {
    res.status(500).json(err); 
}
;
// fourth is connecting the client
client.connect().then(()=>{
    server.listen(PORT,()=>{
        console.log(`listining to port ${PORT}`)
    })
})


