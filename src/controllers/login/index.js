const passport = require('passport');

let login ={};


login.getSignin = (req,res)=>{
    res.render('login/signin');
};

login.getSignup = (req,res)=>{
    res.render('login/signup')
};


module.exports = login;