const pool = require('../lib/database');


module.exports = async()=>{
    const Usuarios = await pool.query('SELECT * FROM usuarios ORDER BY nSeguidores DESC');
    return Usuarios;
}
