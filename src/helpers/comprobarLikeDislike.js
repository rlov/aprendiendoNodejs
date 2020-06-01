const pool = require('../lib/database');


module.exports = async(pathPublicacion,idUser)=>{
    let idPublicaciones = [],
        estadoLike = [],
        estadoDislike = [];

    for (let i = 0; i < pathPublicacion.length; i++) {
        const Publicacion = await pool.query('SELECT * FROM publicacion WHERE pathImage REGEXP ?',[`^${pathPublicacion[i]}`])
        idPublicaciones.push(Publicacion[0].id);
        if(idPublicaciones.length == pathPublicacion.length){
            for (let i = 0; i < idPublicaciones.length; i++) {
                const like = await pool.query('SELECT * FROM likes WHERE idPublicacion = ? AND idUser = ?',[idPublicaciones[i],idUser]);
                const dislike = await pool.query('SELECT * FROM dislikes WHERE idPublicacion = ? AND idUser = ?',[idPublicaciones[i],idUser]);
                if(like.length > 0){
                    //Entonces ya le habíamos dado like
                    estadoLike.push('like');
                    estadoDislike.push('no');
                }
                else if(dislike.length > 0){
                    //Entonces ya le habíamos dado dislike
                    estadoDislike.push('dislike');
                    estadoLike.push('no');
                }
                else{
                    estadoLike.push('no');
                    estadoDislike.push('no');
                }
                if(estadoLike.length == pathPublicacion.length){
                    return {
                        estadoLike,
                        estadoDislike
                    }
                }
            }
        }
    }
}