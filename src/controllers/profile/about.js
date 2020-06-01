const path = require('path');
const perfil = {};
const pool = require('../../lib/database');

let about = {};

about.fullname = async(req,res)=>{
    let { username,name,lastname} = req.body;
    await pool.query('UPDATE usuarios SET name = ?, lastname = ? WHERE username = ?',[name,lastname,username]);
    res.json({
        fullname: `${name} ${lastname}`
    })
} 

about.home = async (req,res)=>{
    let { username,home} = req.body;
    await pool.query('UPDATE usuarios SET home = ? WHERE username = ?',[home,username]);
    res.json({
        home
    })
}

about.email = async(req,res)=>{
    let { username,email} = req.body;
    await pool.query('UPDATE usuarios SET email = ? WHERE username = ?',[email,username]);
    res.json({
        email
    })
}

about.mobile = async(req,res)=>{
    let { username,mobile} = req.body;
    await pool.query('UPDATE usuarios SET celular = ? WHERE username = ?',[mobile,username]);
    res.json({
        mobile
    })
}

about.ocupacion = async(req,res)=>{
    let { username,ocupacion} = req.body;
    await pool.query('UPDATE usuarios SET ocupacion = ? WHERE username = ?',[ocupacion,username]);
    res.json({
        ocupacion
    })
}

about.biografia = async(req,res)=>{
    let { username,biografia} = req.body;
    await pool.query('UPDATE usuarios SET biografia = ? WHERE username = ?',[biografia,username]);
    res.json({
        biografia
    })
}

about.hobbies = async(req,res)=>{
    let { username,hobbies} = req.body;
    await pool.query('UPDATE usuarios SET hobbies = ? WHERE username = ?',[hobbies,username]);
    res.json({
        hobbies
    })
}

about.intereses = async(req,res)=>{
    let { username,intereses} = req.body;
    await pool.query('UPDATE usuarios SET intereses = ? WHERE username = ?',[intereses,username]);
    res.json({
        intereses
    })
}

about.educacion = async(req,res)=>{
    let { username,educacion} = req.body;
    await pool.query('UPDATE usuarios SET educacion = ? WHERE username = ?',[educacion,username]);
    res.json({
        educacion
    })
}

about.trabajo = async(req,res)=>{
    let { username,trabajo} = req.body;
    await pool.query('UPDATE usuarios SET trabajo = ? WHERE username = ?',[trabajo,username]);
    res.json({
        trabajo
    })
}


module.exports = about;