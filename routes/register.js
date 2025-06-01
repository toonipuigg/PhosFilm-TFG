const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const {agregarUsuario} = require('./db')

router.get('/', (req, res) => {
    res.render('register')
})

router.post('/', async(req, res) => {
    console.log('Entra al post del register')

    const {nombre, email, password} = req.body

    const passwd_crypt = await bcrypt.hash(password, 8)

    await agregarUsuario({nombre: nombre, email: email, password: passwd_crypt})

    res.redirect('/login')

})
module.exports = router
