const mysql = require('mysql2/promise')
const dotenv = require('dotenv')

dotenv.config()

const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASENAME
})

const agregarUsuario = async(usuario) => {
    await connection.execute('INSERT INTO usuarios (nombre, email, contraseña) VALUES (?, ?, ?)', [usuario.nombre, usuario.email, usuario.password])

}

const comprobarUsuario = async(email) => {
    const [rows] = await connection.execute('SELECT * FROM usuarios WHERE email = ?', [email])
    return rows[0] // Devuelve solo el primer usuario encontrado
}

const agregarFavorito = async (usuarioId, peliculaApiId) => {
    await connection.execute(
        'INSERT INTO peliculas_favoritas (usuario_id, pelicula_api_id) VALUES (?, ?)',
        [usuarioId, peliculaApiId]
    );
};

const existeFavorito = async (usuarioId, peliculaApiId) => {
    const [rows] = await connection.execute(
        'SELECT 1 FROM peliculas_favoritas WHERE usuario_id = ? AND pelicula_api_id = ?',
        [usuarioId, peliculaApiId]
    );
    return rows.length > 0;
};
const eliminarFavorito = async (usuarioId, peliculaApiId) => {
    await connection.execute(
        'DELETE FROM peliculas_favoritas WHERE usuario_id = ? AND pelicula_api_id = ?',
        [usuarioId, peliculaApiId]
    );
};
module.exports = {
    agregarUsuario,
    comprobarUsuario,
    agregarFavorito,
    existeFavorito,
    eliminarFavorito,
    connection
}