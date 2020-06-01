const mysql = require('mysql');
const { database } = require('./keys');
const {promisify} = require('util');

const pool = mysql.createPool(database);
pool.getConnection((err,connection)=>{
    if(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOS'){
            console.log('DATABASE CONNECTION WAS CLOSED');
        }
        if(err.code === 'ER_CON_COUNT_ERROR'){
            console.log('DATABASE HAS TO MANY CONNECTIONS');
        }
        if(err.code === 'ECONNREFUSED'){
            console.log('DATABASE CONNECTION WAS REFUSED');
        }
    }

    if(connection){
        connection.release();
        console.log('BASE DE DATOS CONECTADA');
        return;
    }
})

pool.query = promisify(pool.query);

module.exports = pool;