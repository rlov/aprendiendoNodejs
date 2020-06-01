const express = require('express');
const router = express.Router();

const Inicio = require('../../controllers/inicio');

/**
 * IMPORTANDO EL MÓDULO QUE PROTEGUE RUTAS
 */

const { isLoggedIn } = require('../../lib/protegiendoRutas');


router.get('/inicio',isLoggedIn,Inicio.inicio);

router.post('/inicio/cargandoMasNoticias',Inicio.cargandoMasNoticias);

router.get('/inicio/:idPublicacion/cargandoComentarios',Inicio.cargandoComentarios);

router.post('/inicio/publicacion/newcomentario',Inicio.newComentario);

router.post('/inicio/publicacion/like',Inicio.likePost);

router.post('/inicio/publicacion/dislike',Inicio.dislikePost);

router.get('/inicio/:pathPublicacion/listalikes',Inicio.listalikes);

 router.get('/inicio/:pathPublicacion/listadislikes',Inicio.listadislikes);

//router.get('/inicio/:pathPublicacion/listaviews',Inicio.listaviews);


//PAGINA NOTIFICACIONES
router.get('/notificaciones',(req,res)=>{
    res.render('inicio/notificaciones',{
        userSession: req.user.username
    })
})

module.exports = router;