
let objeto = {};

objeto.isLoggedIn = (req,res,next) =>{
    if(req.isAuthenticated()){
        next()
    }
    else{
        res.redirect('/signin')
    }
}

module.exports = objeto;