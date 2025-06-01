const express = require('express');
const router = express.Router();
// Ruta para marcar una película como favorita
const { agregarFavorito, existeFavorito, eliminarFavorito } = require('./db');

router.post('/', async (req, res) => {
  try {
    const usuario = res.locals.usuario;
    const peliculaApiId = req.body.peliculaId;

    if (!usuario) {
      return res.status(401).json({ ok: false, mensaje: 'No autenticado' });
    }

    const usuarioId = usuario.id;

    const yaExiste = await existeFavorito(usuarioId, peliculaApiId);

    if (yaExiste) {
      await eliminarFavorito(usuarioId, peliculaApiId);
      return res.status(200).json({
        ok: true,
        mensaje: 'Película eliminada de favoritos',
        favorita: false
      });
    } else {
      await agregarFavorito(usuarioId, peliculaApiId);
      return res.status(201).json({
        ok: true,
        mensaje: 'Película agregada a favoritos',
        favorita: true
      });
    }
  } catch (error) {
    console.error('Error al hacer toggle de favorito:', error);
    return res.status(500).json({ ok: false, mensaje: 'Error del servidor' });
  }
});



module.exports = router;
