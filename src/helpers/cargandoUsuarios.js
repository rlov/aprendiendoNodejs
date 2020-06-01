const pool = require('../lib/database');
const path = require('path');

module.exports = async()=>{

    let pathPerfil = [],
        usernames = [],
        fullname = [];
    const resultado = await pool.query('SELECT * FROM usuarios');

    for (let i = 0; i < resultado.length; i++) {
        if(resultado[i].pathPerfil != ''){
            pathPerfil.push(path.join('/img','perfil',resultado[i].pathPerfil));
        }
        else{
            pathPerfil.push('none')
        }
        usernames.push(resultado[i].username);
        fullname.push(`${resultado[i].name} ${resultado[i].lastname}`)
    }

    return Usuarios = {
        pathPerfil,
        usernames,
        fullname
    }

}
