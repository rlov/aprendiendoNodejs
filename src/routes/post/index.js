const express = require('express');
const publicacion = require('../../controllers/post/index');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');
const pool = require('../../lib/database');
const timeago = require('../../helpers/timeago');
const idPublicacion = require('../../helpers/idPublicacion');
var mostPopular = require('../../helpers/mostPopular');
const cargarNotificaciones = require('../../helpers/cargarNotificaciones');


router.post('/newpost', (req, res) => {
    
    
    const { description } = req.body;
    const { id } = req.user;
    let extname = path.extname(req.file.originalname).toLowerCase();

    var savePost = async () => {
        let rutaImagen = idPublicacion() + extname;
        const resultado = await pool.query('SELECT * FROM publicacion WHERE pathImage = ?', [rutaImagen]);
        if (resultado.length > 0) {
            savePost();
        }
        else {
            //Guardamos la imagen
            await fs.rename(req.file.path, path.resolve(`src/public/img/post/${rutaImagen}`));
            let newPost = {
                description,
                id_user: id,
                pathImage: rutaImagen
            }
            await pool.query('INSERT INTO publicacion SET ?', [newPost]);
            let URLidPublicacion = path.basename(rutaImagen, extname);
            res.redirect(`/gallery/${URLidPublicacion}`);
        }
    }

    savePost();

});

router.put('/updatepost',async(req,res)=>{
    let {pathPublicacion, nuevoTitulo} = req.body;
    console.log(req.body);
    const Publicacion = await pool.query('UPDATE publicacion SET description = ? WHERE pathImage REGEXP ?',[nuevoTitulo,`^${pathPublicacion}`]);
    res.json({
        nuevoTitulo
    })
})

router.delete('/deletepost/:pathPublicacion', async(req,res)=>{
    let pathPublicacion = req.params.pathPublicacion;
    console.log(pathPublicacion);
    
    const Publicacion = await pool.query('SELECT * FROM publicacion WHERE pathImage REGEXP ?',[`^${pathPublicacion}`]);

    await pool.query('DELETE FROM notificaciones WHERE idPublicacion = ?',[Publicacion[0].id]);

    await pool.query('DELETE FROM publicacion WHERE pathImage REGEXP ?',[`^${pathPublicacion}`]);

    await fs.unlink(path.resolve('./src/public/img/post/' + Publicacion[0].pathImage));

    res.send('ELIMINADO CORRECTAMENTE');
})

router.get('/gallery/:idpost', async (req, res) => {

    /**
     * PRUEBA
     */
    const UsuarioSession = await pool.query('SELECT * FROM usuarios WHERE id = ?',[req.user.id]);
    let urlPerfilSession = UsuarioSession[0].pathPerfil;

    if(urlPerfilSession != ''){
        urlPerfilSession = path.join('/img','perfil',urlPerfilSession);
    }
    else{
        urlPerfilSession = 'none'
    }

    /**
     * FIN DE PRUEBA
     */
    const objeto = await mostPopular();
    const { arregloPathImagen, idsPublicaciones, titles } = objeto;

    const resultado = await pool.query('SELECT * FROM publicacion WHERE pathImage REGEXP ?', [`^${req.params.idpost}`]);
    let publicacion = resultado[0];
    let idUsuarioQuePublico = resultado[0].id_user;
    const User = await pool.query('SELECT * FROM usuarios WHERE id = ?',[idUsuarioQuePublico]);
    let usernameQuePublico = User[0].username;
    await pool.query('UPDATE publicacion SET views = views + 1 WHERE id = ?', [publicacion.id]);
    
    /**
     * Debemos traer todos los comentarios de dicha publicación
     */
    const comentarios = await pool.query('SELECT * FROM comentarios WHERE id_publicacion = ?', [publicacion.id]);
    
    //let Notificaciones = await cargarNotificaciones(req.user.username);

    let usernames = [];
    if (comentarios.length > 0) {
        comentarios.forEach(async (comentario) => {
            let id_user = comentario.id_user;
            let usuario = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id_user]);
            usernames.push(usuario[0].username);
            console.log('USERNAMESS');
            console.log(usernames);
            if (usernames.length == comentarios.length) {
                res.render('post/index', {
                    userSession: req.user.username,
                    username: usernameQuePublico,
                    description: publicacion.description,
                    fechaPublicacion: timeago(publicacion.fecha),
                    pathImagen: path.join('/img', 'post', `${publicacion.pathImage}`),
                    publicacion,
                    comentarios,
                    timeago: timeago,
                    usernames,
                    arregloPathImagen,
                    idsPublicaciones,
                    titles,
                    //Notificaciones
                    urlPerfilSession
                })
            }
        })
    }
    else {
        res.render('post/index', {
            userSession: req.user.username,
            username: usernameQuePublico,
            description: publicacion.description,
            fechaPublicacion: timeago(publicacion.fecha),
            pathImagen: path.join('/img', 'post', `${publicacion.pathImage}`),
            publicacion,
            comentarios,
            timeago: timeago,
            usernames,
            arregloPathImagen,
            idsPublicaciones,
            titles,
            //Notificaciones
            urlPerfilSession
        })
    }

});

router.post('/gallery/:idpost/newcomentario', async (req, res) => {
    const { comentario, idPublicacion } = req.body;
    await pool.query('UPDATE PUBLICACION SET numeroComentarios = numeroComentarios + 1 WHERE id = ?', [idPublicacion]);
    const id_user = req.user.id;
    let username = req.user.username;
    let newComentario = {
        contenido: comentario,
        id_publicacion: idPublicacion,
        id_user: id_user
    }
    //Ahora guardamos el comentario
    const resultado = await pool.query('INSERT INTO comentarios SET ? ', [newComentario]);
    const objeto = await pool.query('SELECT * FROM comentarios WHERE id = ?', [resultado.insertId]);
    res.json({
        username,
        comentario,
        fecha: timeago(objeto.fecha)
    });
});

router.post('/gallery/:idpost/like', async (req, res) => {

    const clase = req.body.clase;

    if (clase == 'activo') {
        await pool.query('UPDATE publicacion SET likes = likes + 1 WHERE id = ?', [req.params.idpost]);
        /**
         * ACTUALIZAR LA TABLA DE NOTIFICACIONES
         */
        const resultado = await pool.query('SELECT * FROM publicacion WHERE id = ?',[req.params.idpost]);
        let iduserPublicacion = resultado[0].id_user;
        const usuarioReceptor = await pool.query('SELECT * FROM usuarios WHERE id = ?',[iduserPublicacion]);
        let newNotificacion = {
            emisor: req.user.username,
            receptor : usuarioReceptor[0].username,
            tipo: 'like',
            idPublicacion: resultado[0].id
        }
        
        await pool.query('INSERT INTO notificaciones SET ?',[newNotificacion]);
    }
    else {
        await pool.query('UPDATE publicacion SET likes = likes - 1 WHERE id = ?', [req.params.idpost]);
    }
});

router.post('/gallery/:idpost/dislike', async (req, res) => {

    const clase = req.body.class;
    if (clase == 'activo') {
        await pool.query('UPDATE publicacion SET dislike = dislike + 1 WHERE id = ?', [req.params.idpost]);
    }
    else {
        await pool.query('UPDATE publicacion SET dislike = dislike - 1 WHERE id = ?', [req.params.idpost]);
    }
    
})
module.exports = router;