//Expandiendo la barra-chat
$('#btn-expandir-barra-contactos').click(function (e){
    $('#barra-chat').toggleClass('activo');
})


$('#btn-expander-barra-izq-inicio').click(function(e){
    $('#barra-izq-inicio').toggleClass('retraer');
    //Entonces expandiremos o trasladaremos la seccion noticias
    $('#seccion-noticias').toggleClass('barra-izq-inicio-retraida');
})


//Abriendo un chat

const seccionChats = $('#seccion-chats');


$('#barra-chat').on('click','.item-lista-contactos',function (e){
    const usernameContacto = $(this).data('username');
    const UserSession = $(this).data('usersession');
    
   seccionChats.append(`
    
    <div class="chat-user-user" data-usersession="${UserSession}" data-usercontacto="${usernameContacto}">
        <header>
            <p><a href="/profile/${usernameContacto}">${usernameContacto}</a></p>
        </header>
        <ul class="lista-mensajes">

        </ul>
        <div class="contenedor-formulario-mensaje">
            <form class="form-mensaje">
                <input class="input-mensaje" type="text" placeholder="Send Message" autocomplete="off" autofocus>
                <input class="submit-mensaje" type="submit" value="Send">
            </form>
        </div>
    </div>
    `)
})


const socket = io();

let userSession = document.getElementById('barra-chat').dataset.usersession;

socket.emit('new-user',userSession);


$('#seccion-chats').on('submit','.form-mensaje',function (e){
    e.preventDefault();
    let usernameEmisor,
        usernameReceptor,
        mensaje;

    usernameEmisor = $(this).closest('.chat-user-user').data('usersession');
    usernameReceptor = $(this).closest('.chat-user-user').data('usercontacto');
    mensaje = $(this).find('.input-mensaje').val();

    socket.emit('send-message',{
        usernameEmisor,
        usernameReceptor,
        mensaje
    })

    $(this).find('.input-mensaje').val('').focus();
})


socket.on('send-message',(data)=>{
    
    let { usernameEmisor,usernameReceptor,mensaje} = data.data;

    $('.chat-user-user').each(function(){
        let dataSession = $(this).data('usersession');
        let dataContacto = $(this).data('usercontacto');

        if((dataSession == usernameEmisor.trim()) && (dataContacto == usernameReceptor.trim())){
            let listaMensajes = $(this).find('.lista-mensajes');
            listaMensajes.append(`
            <li class="mi-mensaje">
                <p class="contenido-mensaje">${mensaje}</p>
            </li>
            `)
            listaMensajes.scrollTop(listaMensajes.outerHeight(true));
        }

        else if((dataSession == usernameReceptor.trim()) && (dataContacto == usernameEmisor.trim())){
            let listaMensajes = $(this).find('.lista-mensajes');
            listaMensajes.append(`
            <li class="mensaje-emisor">
                <p class="user-emisor">${usernameEmisor}</p>
                <p class="contenido-mensaje">${mensaje}</p>
            </li>
            `)
            listaMensajes.scrollTop(listaMensajes.outerHeight(true));
        }
        
    });
})