const pool = require('./database');

module.exports = async(usernameVisitando)=>{
    const Usuario = await pool.query('SELECT * FROM usuarios WHERE username = ?',[usernameVisitando]);
    return Usuario[0];
}