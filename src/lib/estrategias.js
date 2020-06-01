const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('../helpers/encriptar');
const pool = require('../lib/database');

passport.use('signin',new LocalStrategy({
    usernameField: 'username',
    passwordField : 'password',
    passReqToCallback: true
},async (req,username,password,done)=>{
    const resultado = await pool.query('SELECT * FROM usuarios WHERE username = ?',[username]);
    if(resultado.length > 0){
        const usuario = resultado[0];
        const comparacion = await bcrypt.comparar(password,usuario.password);
        if(comparacion){
            done(null,usuario,req.flash('loginPassword',`HOLAA`));
        }
        else{
            done(null,false,req.flash('loginPassword',`Password incorrect`));
        }
    }
    else{
        return done(null,false,req.flash('loginUsername',"Username incorrect"));
    }
}))
passport.use('signup',new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
},async (req,username,password,done)=>{
    const {name,lastname} = req.body;
    let newUser = {
        name,
        lastname,
        password,
        username
    }
    //Encriptar la contraseña
    newUser.password = await bcrypt.encriptar(password);
    //Comprobando si el userame ya existe
    const resultado = await pool.query('SELECT * FROM usuarios WHERE username = ?',[username]);
    if(resultado.length > 0){
        //Ya existe el usuario
        done(null,false,req.flash('loginUsername',`Username already exists`));
    }
    else{
        //Entonces creamos el usuario
        const resultado = await pool.query('INSERT INTO usuarios SET ?', [newUser]);
        newUser.id = resultado.insertId;
        return done(null,newUser,req.flash('loginUsername','HOLA'));
    } 
}));


passport.serializeUser((user,done)=>{
    done(null,user.id);
})

passport.deserializeUser(async(id,done)=>{
    const resultado = await pool.query('SELECT * FROM usuarios WHERE id = ?',[id]);
    done(null,resultado[0]);
})