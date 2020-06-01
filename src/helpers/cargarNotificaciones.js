const pool = require('../lib/database');
const path = require('path');
const timeago = require('../helpers/timeago');

module.exports = async(username)=>{
    const resultado = await pool.query('SELECT * FROM notificaciones WHERE receptor = ? ORDER BY fecha DESC ',[username]);
    let emisores = [],
        tipos = [],
        idPublicaciones = [],
        rutasImagenes = [],
        urlPublicaciones = [],
        tiempo = [];
    for (let i = 0; i < resultado.length; i++) {
        emisores.push(resultado[i].emisor);
        tipos.push(resultado[i].tipo);
        idPublicaciones.push(resultado[i].idPublicacion)
        tiempo.push(timeago(resultado[i].fecha));
    }

    for (let i = 0; i < idPublicaciones.length; i++) {
        const resultado = await pool.query('SELECT * FROM publicacion WHERE id = ?',[idPublicaciones[i]]);
        let pathImage = resultado[0].pathImage;
        let ext = path.extname(pathImage);
        
        rutasImagenes.push(path.join('/img','post',`${pathImage}`));
        urlPublicaciones.push(path.basename(pathImage,ext));

        if(rutasImagenes.length == idPublicaciones.length){
            let Notificaciones = {
                emisores,
                tipos,
                rutasImagenes,
                urlPublicaciones,
                tiempo
            }

            return Notificaciones;
        }
        
    }
    
}