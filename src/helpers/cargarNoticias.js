const pool = require('../lib/database');
const timeAgo = require('../helpers/timeago');
const path = require('path');

module.exports = async()=>{
    const Noticias = await pool.query('SELECT * FROM publicacion ORDER BY fecha DESC LIMIT 0,6');

    let usernames = [],
        pathImagenes = [],
        urlPublicacion = [],
        pathAvatares = [],
        fecha = [];

    for (let i = 0; i < Noticias.length; i++) {
        let idUsuario = Noticias[i].id_user;
        const Usuario = await pool.query('SELECT * FROM usuarios WHERE id = ?',[idUsuario]);
        usernames.push(Usuario[0].username);
        pathAvatares.push(Usuario[0].pathPerfil);
        
        let extname = path.extname(Noticias[i].pathImage);
        
        pathImagenes.push(path.join('/img','post',`${Noticias[i].pathImage}`));
        urlPublicacion.push(path.basename(Noticias[i].pathImage,extname));
        fecha.push(timeAgo(Noticias[i].fecha));

        if(usernames.length == Noticias.length){
            let objeto = {
                usernamesNoticias: usernames ,
                pathImagenesNoticias: pathImagenes,
                urlPublicacionesNoticias: urlPublicacion,
                fechasNoticias : fecha,
                pathAvatares,
                Noticias
            }
            return objeto;
        }
    }
}