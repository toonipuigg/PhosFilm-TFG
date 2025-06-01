const express = require('express');
const router = express.Router();

const connection = require('./db').connection; 


router.get('/', async (req, res) => {
  const genreMap = req.app.locals.genreMap || {};
  const category = "upcoming";
  const page = 1; // Podrías usar req.query.page para paginar si quieres

  const url = `https://api.themoviedb.org/3/movie/${category}?language=en-US&page=${page}`;
  const authorization = 'Bearer ' + process.env.ACCESSREADAPI;

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: authorization,
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      return res.status(response.status).send('Error al obtener datos de la API');
    }

    const data = await response.json();

    const genreMap = req.app.locals.genreMap || {};
    let peliculasConGenero = data.results.map(pelicula => ({
      ...pelicula,
      genre_names: Array.isArray(pelicula.genre_ids)
        ? pelicula.genre_ids.map(id => genreMap[id] || 'Desconocido')
        : ['Desconocido'],
    }));

    const usuario = res.locals.usuario;

    if (usuario) {
      const [favoritas] = await connection.execute(
        'SELECT pelicula_api_id FROM peliculas_favoritas WHERE usuario_id = ?',
        [usuario.id]
      );

      const favoritasSet = new Set(favoritas.map(f => String(f.pelicula_api_id)));

      peliculasConGenero = peliculasConGenero.map(peli => ({
        ...peli,
        esFavorita: favoritasSet.has(String(peli.id))
      }));
    } else {
      peliculasConGenero = peliculasConGenero.map(peli => ({
        ...peli,
        esFavorita: false
      }));
    }

    res.render("index", {
      titulo: 'Bienvenido a PhosFilm',
      peliculas: peliculasConGenero,
      currentPage: page,
      totalPages: data.total_pages,
      usuario: usuario || null
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno en el servidor');
  }
});


module.exports = router;