const express = require('express');
const router = express.Router();
const pool = require('../../lib/database');

//RUTA PARA LA PÁGINA DE RESULTADOS DE LA BARRA-BUSQUEDA-NAV
router.get('/search/nav',(req,res)=>{
    res.send('HOLA');
}) 

//RUTA PARA RESPONDER A LAS PETICIONES AJAX DE LA BARRA-BUSQUEDA-NAV
router.get('/search/ajax/:input',async(req,res)=>{
    let busqueda = req.params.input;
    
    const resultado = await pool.query('SELECT * FROM usuarios WHERE concat_ws(" ",name,lastname) LIKE ?',[`%${busqueda}%`]);
    let fullnames = [];

    for(let i=0; i<resultado.length;i++){
        fullnames.push({
            username: resultado[i].username,
            fullname: `${resultado[i].name} ${resultado[i].lastname}`
        });
    }

    res.json({
        fullnames
    });
})

module.exports = router;