const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { comprobarUsuario } = require('./db');

router.get('/', (req, res) => {
  res.render('login');
});

router.post('/', async (req, res) => {
  console.log('Entra por el POST del Login');

  const { email, password } = req.body;

  // Verifica si el usuario existe
  const usuarioDB = await comprobarUsuario(email);

  if (!usuarioDB) {
    return res.render('login', { error: 'Usuario no encontrado' });
  }

  console.log('usuarioDB:', usuarioDB);
  // Compara la contraseña introducida con la guardada (hashed)
  const validPassword = await bcrypt.compare(password, usuarioDB['contraseña']);

  if (!validPassword) {
    return res.render('login', { error: 'Contraseña incorrecta' });
  }

  // Usuario válido, guardamos los datos en una cookie
  res.cookie('usuario', JSON.stringify({
    id: usuarioDB.id,
    nombre: usuarioDB.nombre,
    email: usuarioDB.email
  }), { httpOnly: true });

  res.redirect('/');
});

module.exports = router;
