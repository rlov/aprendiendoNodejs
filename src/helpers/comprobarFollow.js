const pool = require('../lib/database');
module.exports = async(userAutenticado,userSeguir)=>{
    /**
     * Esto va a comprobar si ya sigo a tal ususario o no
     */
    const resultado = await pool.query('SELECT * FROM rutaSeguimiento WHERE userSeguidor = ? AND userSiguiendo = ?',[userAutenticado,userSeguir]);
    if(resultado.length > 0 ){
        //Significa que ya seguimos a dicho usuarios
        return true;
    }
    else{
        return false;
    }
}