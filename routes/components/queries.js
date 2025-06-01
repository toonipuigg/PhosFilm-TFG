const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
require('dotenv').config();


const film_playing = 'https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1' //Películas en play
const film_popular = 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1' //Popular film
const film_toprated = 'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1' //Top rated film
const film_upcoming = 'https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1' //Upcoming film

//
//
//
const film_list = async (query) => {
    const url = 'https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1';
    const authorization = 'Bearer ' + process.env.ACCESSREADAPI
    const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: authorization
    }
    };

    fetch(url, options)
        .then(res => res.json())
        .then(json => console.log(json))
        .catch(err => console.error(err));
};

const searchMovie = async (query) => {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.ACCESSREADAPI}&query=${encodeURIComponent(query)}&language=es-ES`;

  const res = await fetch(url);
  const data = await res.json();

  console.log(data.results); // array de películas encontradas
};

module.exports = router;
module.exports = { film_list };
module.exports = { searchMovie };