const pool = require('../lib/database');
const path = require('path');
module.exports = async()=>{
    //Aquí traeremos todas las  publicaciones ordenadas de acuerdo a su popularidad
    const resultado = await pool.query('SELECT * FROM publicacion ORDER BY views DESC');
    let arregloPathImagen = [];
    let idsPublicaciones = [];
    let titles = [];
    resultado.forEach(element => {
        let extname = path.extname(element.pathImage);
        arregloPathImagen.push(path.join('/img','post',`${element.pathImage}`));
        idsPublicaciones.push(path.basename(element.pathImage,extname));
        titles.push(element.description);
    });

    return {
        arregloPathImagen,
        idsPublicaciones,
        titles
    }
}