const pool = require('../lib/database');
const timeago = require('../helpers/timeago');

let objeto = {};

objeto.followers = async(username)=>{

    const resultado = await pool.query('SELECT * FROM rutaSeguimiento WHERE userSiguiendo = ?',[username]);

    let seguidores = [],
        fecha = [];
    
    for (let i = 0; i < resultado.length; i++) {
        seguidores.push(resultado[i].userSeguidor);
        fecha.push(timeago(resultado[i].fecha));
    }
    return {
        seguidores,
        fecha
    };
}

objeto.following = async(username)=>{
    const resultado = await pool.query('SELECT * FROM rutaSeguimiento WHERE userSeguidor = ?',[username]);

    let siguiendo = [];

    for (let i = 0; i < resultado.length; i++) {
        siguiendo.push(resultado[i].userSiguiendo);
    }

    return siguiendo;
}

module.exports = objeto;