const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
require('dotenv').config();


const app = express();

// Configuración del motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const fetchGenres = async () => {
  const url = 'https://api.themoviedb.org/3/genre/movie/list?language=en-US';
  const authorization = 'Bearer ' + process.env.ACCESSREADAPI;

  try {
    const response = await fetch(url, {
      headers: {
        accept: 'application/json',
        Authorization: authorization,
      },
    });
    const data = await response.json();

    const genreMap = data.genres.reduce((acc, genre) => {
      acc[genre.id] = genre.name;
      return acc;
    }, {});

    app.locals.genreMap = genreMap;
    console.log('Géneros cargados:', genreMap);
  } catch (error) {
    console.error('Error cargando géneros:', error);
  }
};

// Llama esta función antes de iniciar el servidor
async function main() {
  await fetchGenres();

  app.use('/movies', moviesRouter);

  app.listen(3000, () => {
    console.log('Servidor iniciado en puerto 3000');
  });
}

main();





// Seguridad
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "http://localhost:3000", "https://image.tmdb.org"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  })
);

app.use((req, res, next) => {
  if (req.cookies.usuario) {
    try {
      res.locals.usuario = JSON.parse(req.cookies.usuario);
    } catch (err) {
      res.locals.usuario = null;
    }
  } else {
    res.locals.usuario = null;
  }
  next();
});

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

const moviesRouter = require('./routes/movies');
app.use('/movies', moviesRouter);

const loginRouter = require('./routes/login')
app.use('/login', loginRouter)

const registerRouter = require('./routes/register')
app.use('/register', registerRouter)

const logoutRouter = require('./routes/logout');
app.use('/logout', logoutRouter);

const favoritosRouter = require('./routes/favoritos');
app.use('/favoritos', favoritosRouter);

// Ruta para manejar errores 404
app.use((req, res, next) => {
  res.status(404).render('404')
})

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});