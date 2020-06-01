const express = require('express');
const router = express.Router();
const passport = require('passport');
const login = require('../../controllers/login/index');

router.get('/signin',login.getSignin);


router.get('/signup',login.getSignup);

router.post('/signin',(req,res)=>{
    passport.authenticate('signin',{
        successRedirect: `/profile`,
        failureRedirect: '/signin',
        failureFlash: true
    })(req,res)
});

router.post('/signup',(req,res)=>{
    passport.authenticate('signup',{
        successRedirect: `/profile`,
        failureRedirect: '/signup',
        failureFlash: true
    })(req,res);
});

module.exports = router;