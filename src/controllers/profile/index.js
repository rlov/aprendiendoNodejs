const path = require('path');
const perfil = {};
const pool = require('../../lib/database');
const siguiendo = require('../../helpers/comprobarFollow');
const timeago = require('../../helpers/timeago');
const cargarNotificaciones = require('../../helpers/cargarNotificaciones');

perfil.mostrarPerfil = async(req,res)=>{
    
    const UsuarioSession = await pool.query('SELECT * FROM usuarios WHERE id = ?',[req.user.id]);
    let urlPerfilSession = UsuarioSession[0].pathPerfil;

    if(urlPerfilSession != ''){
        urlPerfilSession = path.join('/img','perfil',urlPerfilSession);
    }
    else{
        urlPerfilSession = 'none'
    }

    let usernamePerfilVisitando = req.params.username;
    const resultado = await pool.query('SELECT * FROM usuarios WHERE username = ?',[usernamePerfilVisitando]);
    let idPerfilVisitando = resultado[0].id;
    let isMyProfile,
        usernameFinal,
        urlPortada,
        urlPerfil,
        publicaciones,
        esSeguidor,
        nSeguidores = resultado[0].nSeguidores;

    if(resultado[0].pathPortada != ''){
        //Significa que tiene foto de portada
        urlPortada = path.join('/img',`portada`,resultado[0].pathPortada);
    }
    else{
        urlPortada = path.join('/img','portada-default.jpg');
    }

    if(resultado[0].pathPerfil != ''){
        //Significa que tiene foto de perfil
        urlPerfil = path.join('/img','perfil',resultado[0].pathPerfil);
    }
    else{
        urlPerfil = 'none'
    }

    if(idPerfilVisitando == req.user.id){
        console.log('Estás en tu perfil');
        publicaciones = await pool.query('SELECT * FROM publicacion WHERE id_user = ? ORDER BY fecha DESC',[req.user.id]);
        //Entonces puedes cambiar la portada, ver tus publicaciones
        usernameFinal = req.user.username;
        isMyProfile = true;
    }
    else{
        console.log('No es tu perfil');
        //Entonces puedes seguir a dicha persona, ver sus publicaciones, pero no puedes editar la publicación
        publicaciones = await pool.query('SELECT * FROM publicacion WHERE id_user = ? ORDER BY fecha DESC',[idPerfilVisitando]);
        usernameFinal = usernamePerfilVisitando;
        isMyProfile = false;
        /**
         * Aquí comprobamos si ya seguimos al usuario
         */
        esSeguidor =  await siguiendo(req.user.username,usernameFinal);
    }
    /**
     * Haremos una consulta a las publicaciones de este usuario
     */
    
    let rutasPost = [];
    let idsPublicaciones = [];
    publicaciones.forEach((publicacion) => {
        rutasPost.push(path.join('/img','post',`${publicacion.pathImage}`));
        let extname = path.extname(publicacion.pathImage);
        let idPubli = path.basename(publicacion.pathImage,extname);
        idsPublicaciones.push(idPubli)
    });

   // let Notificaciones = await cargarNotificaciones(req.user.username);

   //Cargando la lista de seguidores
   const Followers = await require('../../helpers/followersFollowings').followers(req.params.username);
    res.render('profile/index',{
        userSession : req.user.username,
        username: usernameFinal,
        pathPortada: urlPortada,
        pathPerfil : urlPerfil,
        urlPerfilSession,
        publicaciones,
        rutasPost,
        idsPublicaciones,
        /* pathPerfilUser, */
        isMyProfile,
        esSeguidor,
        nSeguidores,
       // Notificaciones
       Followers,
       Usuario: resultado[0]
    });
}

perfil.cambiarPortada = async(req,res)=>{
    const pathPortada = req.file.originalname;
    const resultado = await pool.query('UPDATE usuarios SET pathPortada = ? WHERE id = ?',[pathPortada,req.user.id]);
    res.send(path.join(`/img/portada/${pathPortada}`))
}

perfil.cambiarAvatar = async(req,res)=>{
    const pathAvatar = req.file.originalname;
    const resultado = await pool.query('UPDATE usuarios SET pathPerfil = ? WHERE id = ?',[pathAvatar,req.user.id]);
    res.send(path.join('/img','perfil',`${pathAvatar}`))
}

perfil.follow = async (req,res)=>{
    /**
     * Debemos obtener el nombre de usuario del usuario al que va seguir y de él mismo
     */
    const userSeguidor = req.user.username,
        userSiguiendo = req.params.username;

    let nuevaRelacion = {
        userSeguidor,
        userSiguiendo
    }

    const resultado = await pool.query('INSERT INTO rutaSeguimiento SET ?',[nuevaRelacion]);
    /**
     * Ahora al userSiguiendo le aumentaremos el numero de seguidores en 1
     */
    await pool.query('UPDATE usuarios SET nSeguidores = nSeguidores + 1 WHERE username = ?',[userSiguiendo]);

    res.send('siguiendo');
}

perfil.notfollow = async (req,res)=>{
    const userSeguidor = req.user.username,
          userSiguiendo = req.params.username;
    const resultado = await pool.query('DELETE FROM rutaSeguimiento WHERE userSeguidor = ? AND userSiguiendo = ?',[userSeguidor,userSiguiendo]);
    console.log(resultado);
    await pool.query('UPDATE usuarios SET nSeguidores = nSeguidores - 1 WHERE username = ?',[userSiguiendo]);
    res.send('Ya no sigues al usuario');
}

perfil.followers = async(req,res)=>{
    const username = req.params.username;
    const resultado = await pool.query('SELECT * FROM rutaSeguimiento WHERE userSiguiendo = ?',[username]);
    const fecha = [];

    for(let i=0;i<resultado.length;i++){
        fecha.push(timeago(resultado[i].fecha));
    }
    res.json({
        resultado,
        fecha
    });
}

perfil.following = async(req,res)=>{
    const username = req.params.username;
    const resultado = await pool.query('SELECT * FROM rutaSeguimiento WHERE userSeguidor = ?',[username]);
    const fecha = [];
    console.log(resultado);
    for(let i=0;i<resultado.length;i++){
        fecha.push(timeago(resultado[i].fecha));
    }
    console.log(resultado);
    res.json({
        resultado,
        fecha
    });
}


module.exports = perfil;