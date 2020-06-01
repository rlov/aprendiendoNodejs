module.exports = ()=>{
    const caracteres = '1gh2F9a3c4m76bCAdefWgh5icjkl0nopQrzTu';
    let idPublicacion = '';
    for(let i=0;i< 6;i++){
        let numeroRandom = parseInt(Math.random()*caracteres.length);
        idPublicacion += caracteres.charAt(numeroRandom);
    }
    return idPublicacion;
}