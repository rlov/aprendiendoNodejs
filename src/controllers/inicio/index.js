const cargarNotificaciones = require('../../helpers/cargarNotificaciones');
const mostPopular = require('../../helpers/mostPopular');
const cargarNoticias = require('../../helpers/cargarNoticias');
const pool = require('../../lib/database');
const path = require('path');
const timeAgo = require('../../helpers/timeago');
const comprobarLikeDislike = require('../../helpers/comprobarLikeDislike');

let objeto = {};


objeto.inicio = async (req, res) => {

    const UsuarioSession = await pool.query('SELECT * FROM usuarios WHERE id = ?',[req.user.id]);
    let urlPerfilSession = UsuarioSession[0].pathPerfil;

    if(urlPerfilSession != ''){
        urlPerfilSession = path.join('/img','perfil',`${urlPerfilSession}`)
    }
    else{
        urlPerfilSession = 'none'
    }

    let { followers, following } = require('../../helpers/followersFollowings');

    const listaFollowers = await followers(req.user.username);
    const listaFollowing = await following(req.user.username);

    //Cargando contactos para LA BARRA-CHAT
    const Contactos = await require('../../helpers/cargandoUsuarios')();

    let { usernamesNoticias, pathImagenesNoticias, urlPublicacionesNoticias, fechasNoticias, pathAvatares,Noticias } = await cargarNoticias();
    //let Notificaciones = await cargarNotificaciones(req.user.username);

    for (let i = 0; i < pathAvatares.length; i++) {
        if(pathAvatares[i] == ''){
            pathAvatares[i] = ''
        }
        else{
            pathAvatares[i] = path.join('/img','perfil',`${pathAvatares[i]}`)
        }
        
    }
    console.log(pathAvatares);
    const { estadoLike, estadoDislike} =  await comprobarLikeDislike(urlPublicacionesNoticias,req.user.id);

    const { arregloPathImagen, idsPublicaciones, titles } = await mostPopular();

    let usuariosPopulares = await require('../../helpers/usuariosPopulares')();

    res.render('inicio/index', {
        userSession: req.user.username,
        //Notificaciones,
        username: req.user.username,
        arregloPathImagen,
        idsPublicaciones,
        titles,
        usernamesNoticias,
        pathImagenesNoticias,
        urlPublicacionesNoticias,
        fechasNoticias,
        pathAvatares,
        /* pathPerfil, */
        urlPerfilSession,
        Noticias,
        usuariosPopulares,
        listaFollowers,
        listaFollowing,
        estadoLike,
        estadoDislike,
        Contactos
    })
}

objeto.cargandoMasNoticias = async (req, res) => {

    let { desde, hasta } = req.body;
    const Publicaciones = await pool.query('SELECT * FROM publicacion');
    let cantidadPublicacions = Publicaciones.length;

    if (hasta <= cantidadPublicacions) {
        //Sí podemos realizar la consulta
        const Noticias = await pool.query(`SELECT * FROM publicacion ORDER BY fecha DESC LIMIT ${desde},${hasta}`);

        let usernames = [],
            pathImagenes = [],
            urlPublicacion = [],
            fecha = [];

        for (let i = 0; i < Noticias.length; i++) {
            let idUsuario = Noticias[i].id_user;
            const Usuario = await pool.query('SELECT * FROM usuarios WHERE id = ?', [idUsuario]);
            usernames.push(Usuario[0].username);

            let extname = path.extname(Noticias[i].pathImage);

            pathImagenes.push(path.join('/img', 'post', `${Noticias[i].pathImage}`));
            urlPublicacion.push(path.basename(Noticias[i].pathImage, extname));
            fecha.push(timeAgo(Noticias[i].fecha));

            if (usernames.length == Noticias.length) {

                const { estadoLike, estadoDislike} = await comprobarLikeDislike(urlPublicacion,req.user.id);
                console.log(estadoLike);
                console.log(estadoDislike);
                let objeto = {
                    usernamesNoticias: usernames,
                    pathImagenesNoticias: pathImagenes,
                    urlPublicacionesNoticias: urlPublicacion,
                    fechasNoticias: fecha,
                    Noticias,
                    estadoLike,
                    estadoDislike
                }

                res.json(objeto);
            }

        }
    }
    else {
        res.send('fin');
    }

}

objeto.cargandoComentarios = async (req, res) => {
    /**
     * PASO 1: Obtener el ID  de la publicación
     */
    let pathPublicacion = req.params.idPublicacion;
    const resultado = await pool.query('SELECT * FROM publicacion WHERE pathImage REGEXP ?', [`^${pathPublicacion}`]);
    const idPublicacion = resultado[0].id;

    /**
     * PASO 2: Obtener los comentarios en base al ID de la publicación
     */

    const Comentarios = await pool.query('SELECT * FROM comentarios WHERE id_publicacion = ? ORDER BY fecha DESC', [idPublicacion]);

    let usernames = [],
        fechas = [];
    for (let i = 0; i < Comentarios.length; i++) {

        const Usuario = await pool.query('SELECT * FROM usuarios WHERE id = ?', [Comentarios[i].id_user]);
        usernames.push(Usuario[0].username);
        fechas.push(timeAgo(Comentarios[i].fecha));
        if (Comentarios.length == usernames.length) {

            res.json({
                usernamesComentarios: usernames,
                fechasComentarios: fechas,
                Comentarios
            })
        }
    }
}

objeto.newComentario = async (req, res) => {
    const { pathPublicacion, contenidoComentario } = req.body;

    const Publicacion = await pool.query('SELECT * FROM publicacion WHERE pathImage REGEXP ?', [`^${pathPublicacion}`]);

    const idPublicacion = Publicacion[0].id;

    //Aumentamos el número de comentarios de dicha publicación
    await pool.query('UPDATE publicacion SET numeroComentarios = numeroComentarios + 1 WHERE id = ?', [idPublicacion]);


    let newComentario = {
        contenido: contenidoComentario,
        id_publicacion: idPublicacion,
        id_user: req.user.id
    }

    //Insertamos el nuevo comentario en la base de datos

    const resultado = await pool.query('INSERT INTO comentarios SET ?', [newComentario]);
    let comentarioReciente = await pool.query('SELECT * FROM comentarios WHERE id = ?', [resultado.insertId]);

    newComentario.fecha = timeAgo(comentarioReciente[0].fecha);
    newComentario.username = req.user.username;
    res.json(newComentario);
}

objeto.likePost = async (req, res) => {
    const { pathPublicacion, action } = req.body;

    const Publicacion = await pool.query('SELECT * FROM publicacion WHERE pathImage REGEXP ?', [`^${pathPublicacion}`]);
    const idPublicacion = Publicacion[0].id,
    iduserPublicacion = Publicacion[0].id_user;

    const resultado = await pool.query('SELECT * FROM dislikes WHERE idPublicacion = ? AND idUser = ?', [idPublicacion, req.user.id]);

    let dislikeExiste = 'no';

    if (resultado.length > 0) {
        await pool.query('DELETE FROM dislikes WHERE id = ?', [resultado[0].id]);
        await pool.query('UPDATE publicacion SET dislike = dislike - 1 WHERE pathImage REGEXP ?', [`^${pathPublicacion}`]);
        dislikeExiste = 'si';
    }

    if (action == 'like') {
        //Queremos dar like
        await pool.query('UPDATE publicacion SET likes = likes + 1 WHERE pathImage REGEXP ?', [`^${pathPublicacion}`]);
        let Like = {
            idUser: req.user.id,
            idPublicacion
        }

        await pool.query('INSERT INTO likes SET ?', [Like]);

        const usuarioReceptor = await pool.query('SELECT * FROM usuarios WHERE id = ?',[iduserPublicacion]);
        let newNotificacion = {
            emisor: req.user.username,
            receptor : usuarioReceptor[0].username,
            tipo: 'like',
            idPublicacion
        }

        await pool.query('INSERT INTO notificaciones SET ?',[newNotificacion]);
    }
    if (action == 'noLike') {
        //Queremos quitar nuestro like

        await pool.query('UPDATE publicacion SET likes = likes - 1 WHERE pathImage REGEXP ?', [`^${pathPublicacion}`]);
        await pool.query('DELETE FROM likes WHERE idPublicacion = ? AND idUser = ?', [idPublicacion, req.user.id]);
    }


    res.status(200).json({
        dislikeExiste
    });
}

objeto.dislikePost = async (req, res) => {
    const { pathPublicacion, action } = req.body;

    const Publicacion = await pool.query('SELECT * FROM publicacion WHERE pathImage REGEXP ?', [`^${pathPublicacion}`]);
    const idPublicacion = Publicacion[0].id,
        iduserPublicacion = Publicacion[0].id_user;

    const resultado = await pool.query('SELECT * FROM likes WHERE idPublicacion = ? AND idUser = ?', [idPublicacion, req.user.id]);

    let likeExiste = 'no';

    if (resultado.length > 0) {
        await pool.query('DELETE FROM likes WHERE id = ?', [resultado[0].id]);
        await pool.query('UPDATE publicacion SET likes = likes - 1 WHERE pathImage REGEXP ?', [`^${pathPublicacion}`]);
        likeExiste = 'si';
    }

    if (action == 'dislike') {
        //Queremos dar like
        await pool.query('UPDATE publicacion SET dislike = dislike + 1 WHERE pathImage REGEXP ?', [`^${pathPublicacion}`]);
        let Like = {
            idUser: req.user.id,
            idPublicacion
        }
        await pool.query('INSERT INTO dislikes SET ?', [Like]);
        const usuarioReceptor = await pool.query('SELECT * FROM usuarios WHERE id = ?',[iduserPublicacion]);
        let newNotificacion = {
            emisor: req.user.username,
            receptor : usuarioReceptor[0].username,
            tipo: 'dislike',
            idPublicacion
        }

        await pool.query('INSERT INTO notificaciones SET ?',[newNotificacion]);
    }
    if (action == 'noDislike') {
        //Queremos quitar nuestro like
        await pool.query('UPDATE publicacion SET dislike = dislike - 1 WHERE pathImage REGEXP ?', [`^${pathPublicacion}`]);
        await pool.query('DELETE FROM dislikes WHERE idPublicacion = ? AND idUser = ?', [idPublicacion, req.user.id]);
    }

    res.status(200).json({
        likeExiste
    });
}

objeto.listalikes = async (req,res)=>{
    let  pathPublicacion  = req.params.pathPublicacion;
    
    const Publicacion = await pool.query('SELECT * FROM publicacion WHERE pathImage REGEXP ?',[`^${pathPublicacion}`]);
    const idPublicacion = Publicacion[0].id;

    //Trayendo la lista de usuarios que dieron like
    const Likes = await pool.query('SELECT * FROM likes WHERE idPublicacion = ?',[idPublicacion]);
    let usernamesLikes = [],
        fullnameLikes = [];
    for (let i = 0; i < Likes.length; i++) {
        let Usuario = await pool.query('SELECT * FROM usuarios WHERE id = ?',[Likes[i].idUser]);
        usernamesLikes.push(Usuario[0].username);
        fullnameLikes.push(Usuario[0].name);
    }
    res.json({
        usernamesLikes,
        fullnameLikes,
    });
}

objeto.listadislikes = async(req,res)=>{
    //Trayendo la lista de usuarios que le han dado dislike
    let  pathPublicacion  = req.params.pathPublicacion;
    const Publicacion = await pool.query('SELECT * FROM publicacion WHERE pathImage REGEXP ?',[`^${pathPublicacion}`]);
    console.log(Publicacion);
    const idPublicacion = Publicacion[0].id;

    const Dislikes = await pool.query('SELECT * FROM dislikes WHERE idPublicacion = ?',[idPublicacion]);
    
    let usernamesDislikes = [],
        fullnameDislikes = [];
    for (let i = 0; i < Dislikes.length; i++) {
        let Usuario = await pool.query('SELECT * FROM usuarios WHERE id = ?',[Dislikes[i].idUser]);
        usernamesDislikes.push(Usuario[0].username);
        fullnameDislikes.push(Usuario[0].name);
    } 

    res.json({
        usernamesDislikes,
        fullnameDislikes
    })

}

module.exports = objeto;