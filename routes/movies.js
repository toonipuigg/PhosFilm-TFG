const express = require('express');
const router = express.Router();
// Llama una vez al iniciar
const connection = require('./db').connection; // Ajusta según tu proyecto
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const genreURL = 'https://api.themoviedb.org/3/genre/movie/list?language=en-US';
const API_KEY = process.env.ACCESSREADAPI;

async function cargarGenres() {
  try {
    const response = await fetch(genreURL, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
    });
    const data = await response.json();
    app.locals.genreMap = data.genres.reduce((acc, genre) => {
      acc[genre.id] = genre.name;
      return acc;
    }, {});
    console.log('Géneros cargados correctamente');
  } catch (error) {
    console.error('Error cargando géneros:', error);
  }
}

// Llama al cargar géneros al iniciar el servidor
cargarGenres();


// Ruta para categoría sin página (página 1 por defecto)
router.get('/:category', async (req, res) => {
  const genreMap = req.app.locals.genreMap || {};
  const category = req.params.category;
  const page = parseInt(req.query.page) || 1;

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

    // Tomamos el genreMap cargado globalmente en app.locals
    const genreMap = req.app.locals.genreMap || {};

    // Mapear correctamente los géneros
    let peliculasConGenero = data.results.map(pelicula => ({
      ...pelicula,
      genre_names: Array.isArray(pelicula.genre_ids)
        ? pelicula.genre_ids.map(id => genreMap[id] || 'Desconocido')
        : ['Desconocido'],
    }));

    // Obtener usuario si está logueado (lo tienes en res.locals.usuario)
    const usuario = res.locals.usuario;

    if (usuario) {
      // Consultar las películas favoritas del usuario en la DB
      const [favoritas] = await connection.execute(
        'SELECT pelicula_api_id FROM peliculas_favoritas WHERE usuario_id = ?',
        [usuario.id]
      );

      const favoritasSet = new Set(favoritas.map(f => String(f.pelicula_api_id)));

      // Marcar si la película está en favoritos
      peliculasConGenero = peliculasConGenero.map(peli => ({
        ...peli,
        esFavorita: favoritasSet.has(String(peli.id))
      }));
    } else {
      // Si no hay usuario, ninguna película está marcada como favorita
      peliculasConGenero = peliculasConGenero.map(peli => ({
        ...peli,
        esFavorita: false
      }));
    }

    res.render("films", {
      titulo: 'Películas',
      peliculas: peliculasConGenero,
      currentPage: page,
      totalPages: data.total_pages,
      category,
      usuario: usuario || null
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno en el servidor');
  }
});




module.exports = router;
