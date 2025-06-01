const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.clearCookie('usuario');
  res.redirect('/');
});

module.exports = router;
