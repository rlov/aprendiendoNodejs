const bcrypt = require('bcryptjs');

let objeto = {};

objeto.encriptar = async(password) =>{
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password,salt);
}

objeto.comparar = async(password,savedPassword) =>{
    try{
        return await bcrypt.compare(password,savedPassword);
    }catch(e){
        console.log(e);
    }
}


module.exports = objeto;