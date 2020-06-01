const publicacion = {};
const pool = require('../../lib/database');

publicacion.newPost = (req,res)=>{
    console.log('BODYYYYYYYYYYYYYYY');
    console.log(req.body);
    console.log('USUARIO: ---------------  ');
    console.log(req.user);
    res.send('RECIBIDO');
}



module.exports = publicacion;