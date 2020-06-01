const pool = require('../../lib/database');

module.exports = (io) => {
    io.on('connection', (socket) => {
        var userSession;
        socket.on('new-user', async (name) => {
            userSession = name;
            let contactos = [];
            const resultado1 = await pool.query('SELECT * FROM rutaSeguimiento WHERE userSiguiendo = ?', [name]);
            const resultado2 = await pool.query('SELECT * FROM rutaSeguimiento WHERE userSeguidor = ?', [name]);
            for (let i = 0; i < resultado1.length; i++) {
                if (contactos.indexOf(resultado1[i].userSeguidor) == -1) {
                    contactos.push(resultado1[i].userSeguidor);
                }
            }

            for (let i = 0; i < resultado2.length; i++) {
                if (contactos.indexOf(resultado2[i].userSiguiendo) == -1) {
                    contactos.push(resultado2[i].userSiguiendo);
                }
            }
            generandoRooms(name, contactos, socket);
        })

        /* socket.on('send-message',(mensaje)=>{
            socket.to(`${userSession}:ruth10`).to(`ruth10:${userSession}`).emit('send-message',{
                emisor : userSession,
                mensaje : mensaje
            });
        }) */
        socket.on('send-message',(data)=>{
            let { usernameEmisor,usernameReceptor,mensaje} = data;
            io.to(`${usernameEmisor}:${usernameReceptor}`).to(`${usernameReceptor}:${usernameEmisor}`).emit('send-message',{
                data
            })
        })
    })
}

function generandoRooms(userSession, contactos, socket) {
    let arregloRooms = [];
    for (let i = 0; i < contactos.length; i++) {
        arregloRooms.push(`${userSession}:${contactos[i]}`);
        arregloRooms.push(`${contactos[i]}:${userSession}`);
    }
    /* socket.join(`rlov:ruth10`,()=>{
        //Mostrando rooms
        let rooms = Object.keys(socket.rooms);
        console.log(rooms);
    }); */
    console.log(arregloRooms);

    socket.join(arregloRooms,()=>{
        //Mostrando rooms
        let rooms = Object.keys(socket.rooms);
        console.log(rooms);
    });
}


