const express = require('express');
const router = express.Router();
const profile = require('../../controllers/profile/index');
const about = require('../../controllers/profile/about');

/**
 * IMPORTANDO EL MÓDULO QUE PROTEGUE RUTAS
 */

const { isLoggedIn } = require('../../lib/protegiendoRutas');

router.get('/profile',isLoggedIn,(req,res)=>{
    res.redirect(`/profile/${req.user.username}`);
})

router.get('/profile/:username',isLoggedIn, profile.mostrarPerfil);

router.post('/profile/:username/updatecover',profile.cambiarPortada);

router.post('/profile/:username/updateavatar',profile.cambiarAvatar);

router.get('/logout',(req,res)=>{
    req.logOut();
    res.redirect('/signin');
})

router.post('/profile/:username/follow',profile.follow);

router.post('/profile/:username/notfollow',profile.notfollow);

router.get('/profile/:username/followers',profile.followers);

router.get('/profile/:username/following',profile.following);

router.post('/about/:username/fullname',about.fullname);

router.post('/about/:username/home',about.home);

router.post('/about/:username/email',about.email);

router.post('/about/:username/mobile',about.mobile);

router.post('/about/:username/ocupacion',about.ocupacion);

router.post('/about/:username/biografia',about.biografia);

router.post('/about/:username/hobbies',about.hobbies);

router.post('/about/:username/intereses',about.intereses);

router.post('/about/:username/educacion',about.educacion);

router.post('/about/:username/trabajo',about.trabajo);

module.exports = router;